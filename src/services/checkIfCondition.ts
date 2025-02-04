import * as chrono from 'chrono-node'
import { getDate, getWeek, getWeekOfMonth } from 'date-fns'

import getDateInYYYYMMDD from '../utils/getDateInYYYYMMDD'

export default function checkIfCondition(matched: string, nlp?: boolean) {
  const checkerObj = {
    ['IFDAYOFWEEK']: 'day',
    ['IFMONTHOFYEAR']: 'month',
    ['IFYEAR']: 'year',
    ['IFWEEKOFMONTH']: 'weekofmonth',
    ['IFWEEKOFYEAR']: 'weekofyear',
    ['IFDATEOFMONTH']: 'dateofmonth',
  }

  if (!nlp) {
    let comparator: number
    // @ts-expect-error Type because of indexing
    switch (checkerObj[matched.split(':')[0]!]) {
      case 'day':
        comparator = new Date().getDay()
        break

      case 'month':
        comparator = new Date().getMonth()
        break

      case 'year':
        comparator = new Date().getFullYear()
        break

      case 'weekofmonth':
        comparator = getWeekOfMonth(new Date())
        break

      case 'weekofyear':
        comparator = getWeek(new Date())
        break

      case 'dateofmonth':
        comparator = getDate(new Date())
        break

      default:
        return false
    }

    let state = false
    const checker = matched.split(':')[1]!.split(',')

    for (const i of checker) {
      if (comparator === parseInt(i)) {
        state = true
      }
    }

    return state
  } else {
    const dateToCheck = chrono.parseDate(matched.split(':')[1]!)
    if (!dateToCheck) return false
    return getDateInYYYYMMDD(dateToCheck) === getDateInYYYYMMDD(new Date())
  }
}
