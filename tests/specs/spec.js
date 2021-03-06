/* eslint-env mocha */

import { strict as assert } from 'assert'
import isbot from '../../src/index.js'
import fixtures from '../../fixtures/index.json'

const { browsers = [], crawlers = [] } = fixtures
const { equal, fail } = assert

describe(
  'specs',
  () => {
    it(`should return false for all ${browsers.length} browsers`, () => {
      const recognised = browsers.filter(isbot)
      recognised.length && fail([
        `Recognised as bots ${recognised.length} user agents:`,
        ...recognised
      ].join('\n'))
    })

    it(`should return true for all ${crawlers.length} crawlers`, () => {
      const unrecognised = crawlers.filter(ua => !isbot(ua))
      unrecognised.length && fail([
        `Unrecognised as bots ${unrecognised.length} user agents:`,
        ...unrecognised.map(item => ` - ${item}`)
      ].join('\n'))
    })

    describe('isbot.extend', () => {
      const useragent = 'Mozilla/5.0'
      const rule = '^mozilla\\/\\d\\.\\d$'

      it(`should not detect "${useragent}" as bot`, () => {
        assert(!isbot(useragent))
      })

      it(`should detect "${useragent}" as bot`, () => {
        isbot.extend([rule])
        assert(isbot(useragent))
      })

      it('should not extend an existing item', () => {
        isbot.extend([rule])
        isbot.extend([rule])
        isbot.extend([rule])
        isbot.exclude([rule])
        assert(!isbot(useragent))
      })
    })

    describe('isbot.exclude', () => {
      const useragent = 'axios/1.2'
      const rule = '^axios/'

      it(`should not detect "${useragent}" as bot`, () => {
        assert(isbot(useragent))
      })

      it(`should detect "${useragent}" as bot`, () => {
        isbot.exclude([rule])
        assert(!isbot(useragent))
      })

      it('should remain silent when excluding non existing filter', () => {
        isbot.exclude(['something'])
      })
    })

    describe('isbot.find', () => {
      it('should return null for non bot browser', () => {
        equal(isbot.find('Mozilla'), null)
      })

      it('should return the rule used to identify as bot', () => {
        equal(isbot.find('Mozilla/5.0 (compatible; SemrushBot-SA/0.97; +http://www.semrush.com/bot.html)'), 'Bot')
      })
    })
  }
)
