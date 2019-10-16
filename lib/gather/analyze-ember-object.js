module.exports = function analyzeEmberObject(possibleEmberObject) {
  if (typeof possibleEmberObject !== 'object' || possibleEmberObject === null) {
    return undefined;
  }
  if (possibleEmberObject.default && typeof possibleEmberObject.default.proto !== 'function') {
    return undefined;
  }
  let proto = possibleEmberObject.default.proto();

  // Ember here is assumed to be global when ran within the context of the browser
  /* globals Ember */
  let meta = Ember.meta(proto);

  // eslint-disable-next-line no-undef
  if (!meta || !meta.source) {
    return {};
  }
  const { source } = meta;
  const type = getType(source);

  const ownProperties = Object.keys(source).filter(key => !['_super', 'actions'].includes(key));

  const ownActions = source.actions ? Object.keys(source.actions) : [];

  const observedProperties = Object.keys(meta._watching || {});

  const overriddenProperties = ownProperties.filter(key => isOverridden(meta.parent, key));

  const overriddenActions = ownActions.filter(key => isActionOverridden(meta.parent, key));

  const computedProperties = [];
  meta.forEachDescriptors((name, desc) => {
    const descProto = Object.getPrototypeOf(desc) || {};
    const constructorName = descProto.constructor ? descProto.constructor.name : '';
    if (desc.enumerable && ownProperties.includes(name) && constructorName === 'ComputedProperty') {
      computedProperties.push(name);
    }
  });

  function getType(object) {
    const types = [
      'Application',
      'Controller',
      'Route',
      'Component',
      'Service',
      'Helper',
      'Router',
      'Engine',
    ];
    // eslint-disable-next-line no-undef
    return types.find(type => Ember[type] && object instanceof Ember[type]) || 'EmberObject';
  }

  /**
   * Parses ember meta data object and collects the runtime information
   *
   * @param {Object} meta
   * @returns {Object} data - Parsed metadata for the ember object
   * @returns {String[]} data.computedProperties - list of computed properties
   * @returns {String[]} data.getters - list of ES5 getters
   * @returns {String[]} data.observedProperties - list of observed properties
   * @returns {Object} data.observerProperties - list of observer properties
   * @returns {Object} data.offProperties - list of observer properties
   * @returns {String[]} data.overriddenActions - list of overridden actions
   * @returns {String[]} data.overriddenProperties - list of overridden properties
   * @returns {String[]} data.ownProperties - list of object's own properties
   * @returns {String} data.type - type of ember object
   * @returns {Object} data.unobservedProperties - list of unobserved properties
   */

  const ownDesc = Object.getOwnPropertyDescriptors(source);
  const getters = Object.keys(ownDesc).filter(
    key => ownDesc[key].get && !computedProperties.includes(key)
  );

  const { offProperties, unobservedProperties } = ownProperties.reduce(
    ({ offProperties, unobservedProperties }, key) => {
      const { type, events } = getListenerData(meta.parent, key);
      if (type === 'event') {
        offProperties[key] = events;
      } else if (type === 'observer') {
        unobservedProperties[key] = events;
      }
      return { offProperties, unobservedProperties };
    },
    {
      offProperties: {},
      unobservedProperties: {},
    }
  );

  const observerProperties = observedProperties.reduce((acc, oProp) => {
    const listenerData = meta.matchingListeners(`${oProp}:change`);
    if (listenerData) {
      const listener = listenerData[1];
      acc[listener] = [].concat(acc[listener] || [], [oProp]);
    }
    return acc;
  }, {});

  return {
    computedProperties,
    getters,
    observedProperties,
    observerProperties,
    offProperties,
    overriddenActions,
    overriddenProperties,
    ownProperties,
    type,
    unobservedProperties,
  };
};

/**
 * Parses the ember meta with passed key
 *
 * @param {Ember.meta} map
 * @param {String} key
 * @returns {Object} meta - The listener meta data
 * @returns {String} meta.type - Type of listener can be observer|event
 * @returns {String[]} meta.events - name of events/properties the listener is registered on
 */
function getListenerData(map, key) {
  while (map) {
    let type = 'event';
    const events = parseListeners(map._listeners).reduce((acc, [event, , method]) => {
      if (method === key) {
        const [observedProp, observerEvent] = event.split(':');
        if (observerEvent) {
          type = 'observer';
        }
        acc.push(observedProp);
      }
      return acc;
    }, []);
    if (events.length) {
      return {
        type,
        events,
      };
    }
    map = map.parent;
  }
  return {};
}

/**
 * Parse the listeners to a group of array of 4 elements
 *
 * @param {Array} listeners
 * @param {int} size
 * @returns Array
 */
function parseListeners(listeners = [], size = 4) {
  var result = [];
  if (listeners.length) {
    if (typeof listeners[0] === 'object') {
      result = listeners.map(({ event, target, method, kind }) => [event, target, method, kind]);
    } else {
      const input = listeners.slice(0);
      while (input.length) {
        result.push(input.splice(0, size));
      }
    }
  }
  return result;
}

/**
 * Checks if passed key is overriding any value from the parent objects
 *
 * @param {Object} map
 * @param {String} key
 * @returns boolean
 */
function isOverridden(map, key) {
  while (map) {
    const value = map.peekValues ? map.peekValues(key) : undefined;
    if (value !== undefined || (map.source && key in map.source)) {
      return true;
    }
    map = map.parent;
  }
  return false;
}

/**
 * Checks if passed key is overriding any value from the parent objects' actions
 *
 * @param {Object} map
 * @param {String} key
 * @returns boolean
 */
function isActionOverridden(map, key) {
  while (map) {
    const { source } = map;
    if (source) {
      const { actions } = source;
      const value = actions ? actions[key] : undefined;
      if (value !== undefined) {
        return true;
      }
    }
    map = map.parent;
  }
  return false;
}
