/**
 * Unknown Armies 3E Handlebars Helpers
 */

export function registerHandlebarsHelpers() {

  /**
   * Localize a string
   */
  Handlebars.registerHelper('localize', function(key) {
    return game.i18n.localize(key);
  });

  /**
   * Format a string with arguments
   */
  Handlebars.registerHelper('format', function(key, ...args) {
    const options = args.pop();
    return game.i18n.format(key, args[0] || {});
  });

  /**
   * Check if value equals target
   */
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });

  /**
   * Check if value not equals target
   */
  Handlebars.registerHelper('ne', function(a, b) {
    return a !== b;
  });

  /**
   * Check if value is greater than target
   */
  Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });

  /**
   * Check if value is less than target
   */
  Handlebars.registerHelper('lt', function(a, b) {
    return a < b;
  });

  /**
   * Check if value is greater than or equal to target
   */
  Handlebars.registerHelper('gte', function(a, b) {
    return a >= b;
  });

  /**
   * Check if value is less than or equal to target
   */
  Handlebars.registerHelper('lte', function(a, b) {
    return a <= b;
  });

  /**
   * Multiply two values
   */
  Handlebars.registerHelper('multiply', function(a, b) {
    return (parseFloat(a) || 0) * (parseFloat(b) || 0);
  });

  /**
   * Divide two values
   */
  Handlebars.registerHelper('divide', function(a, b) {
    return b ? (parseFloat(a) || 0) / parseFloat(b) : 0;
  });

  /**
   * Add two values
   */
  Handlebars.registerHelper('add', function(a, b) {
    return (parseFloat(a) || 0) + (parseFloat(b) || 0);
  });

  /**
   * Subtract two values
   */
  Handlebars.registerHelper('subtract', function(a, b) {
    return (parseFloat(a) || 0) - (parseFloat(b) || 0);
  });

  /**
   * Get percentage of value relative to max
   */
  Handlebars.registerHelper('percentage', function(value, max) {
    return max ? Math.round((parseFloat(value) / parseFloat(max)) * 100) : 0;
  });

  /**
   * Repeat a block N times
   */
  Handlebars.registerHelper('times', function(n, block) {
    let result = '';
    for (let i = 0; i < n; i++) {
      result += block.fn(i);
    }
    return result;
  });

  /**
   * Iterate from start to end
   */
  Handlebars.registerHelper('for', function(from, to, block) {
    let result = '';
    for (let i = from; i <= to; i++) {
      result += block.fn(i);
    }
    return result;
  });

  /**
   * JSON stringify
   */
  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });

  /**
   * Console log for debugging
   */
  Handlebars.registerHelper('log', function(context) {
    console.log(context);
    return '';
  });

  /**
   * Check if array includes value
   */
  Handlebars.registerHelper('includes', function(array, value) {
    if (!Array.isArray(array)) return false;
    return array.includes(value);
  });

  /**
   * Get length of array or string
   */
  Handlebars.registerHelper('length', function(value) {
    return value ? value.length : 0;
  });

  /**
   * Uppercase first letter
   */
  Handlebars.registerHelper('capitalize', function(string) {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  });

  /**
   * Get stress gauge color
   */
  Handlebars.registerHelper('gaugeColor', function(gauge) {
    const colors = {
      violence: '#8B0000',
      helplessness: '#4B0082',
      theUnnatural: '#006400',
      isolation: '#8B4513',
      self: '#2F4F4F'
    };
    return colors[gauge] || '#666666';
  });

  /**
   * Get threat level color
   */
  Handlebars.registerHelper('threatColor', function(level) {
    const colors = {
      low: '#228B22',
      medium: '#FFD700',
      mediumHigh: '#FF8C00',
      high: '#FF4500',
      veryHigh: '#DC143C',
      extreme: '#8B0000'
    };
    return colors[level] || '#666666';
  });

  /**
   * Roll result CSS class
   */
  Handlebars.registerHelper('rollClass', function(result) {
    if (result.isCriticalSuccess) return 'critical-success';
    if (result.isCriticalFailure) return 'critical-failure';
    if (result.isMatched && result.isSuccess) return 'matched-success';
    if (result.isMatched && !result.isSuccess) return 'matched-failure';
    if (result.isSuccess) return 'success';
    return 'failure';
  });
}