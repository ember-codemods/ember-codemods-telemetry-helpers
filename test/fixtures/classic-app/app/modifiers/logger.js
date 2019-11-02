import Modifier from 'ember-class-based-modifier';

export default class LoggerModifier extends Modifier {
  didInstall() {
    console.log(this.element)
  }
}
