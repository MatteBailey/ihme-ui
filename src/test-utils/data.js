import { map } from 'lodash';
import cuid from 'cuid';
import random from 'random-js';

/**
 * Random data generator
 * @param {Object} config -> configuration object with the following properties:
 *  {String} dataQuality -> one of 'best'|'worst'|'mixed'
 *    'best' = no data quality issues (no null or missing values)
 *    'worst' = a lot of data quality issues (lots of null or missing values)
 *    'mixed' = some null values
 *  {Number} length -> number of data
 *  {String} keyField -> a field of datum that uniquely identifies it
 *  {String} valueField -> a field of datum that holds the "primary" datum (e.g., 'value' or 'mean')
 *  {Boolean} useDates -> whether to use dates for valueField
 *  {Number} startYear -> if (useDates), values will start at startYear
 *  {Any} any other property that will be passed directly to individual datum
 * @return {Array} array of datum objects
 */
export const dataGenerator = (config = {}) => {
  const {
    dataQuality = 'best',
    length = 200,
    keyField = 'location_id',
    valueField = 'value',
    useDates = false,
    startYear = (new Date()).getFullYear(),
    ...rest
  } = config;
  const ret = new Array(length);
  const randomGenerator = random();

  const yearProducer = (function* yearProducer() {
    for (let year = startYear - length + 1; year <= startYear; year++) {
      yield year;
    }
  }());

  const valueProducer = (() => {
    return () => {
      const randNum = randomGenerator.real(0, 999999);
      let val;
      let useInt;

      switch (dataQuality) {
        case 'best':
          val = randNum;
          break;
        case 'mixed':
          useInt = randomGenerator.bool(0.75); // 75% chance of true
          val = useInt ? randNum : null;
          break;
        case 'worst':
          useInt = randomGenerator.bool(0.25); // 25% chance of true
          val = useInt ? randNum : null;
          break;
        default:
          val = randNum;
      }

      return val;
    };
  })();

  return map(ret, () => {
    return {
      [keyField]: useDates ? yearProducer.next().value : cuid(), // collision-resistant string id
      [valueField]: valueProducer(),
      ub: valueProducer(),
      lb: valueProducer(),
      ...rest
    };
  });
};