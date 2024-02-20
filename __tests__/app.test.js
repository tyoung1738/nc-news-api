const app = require(`../app/app`)
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const apiEndpointsJSON = require('../endpoints.json')

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
})

describe("GET requests", ()=>{
    test("GET /api/topics - should return an array of objects with properties 'slug' and 'description", ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            const {topics} = body
            topics.forEach((topic)=>{
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
    test("GET /api/notARoute - should return 404 not found for invalid endpoint", ()=>{
        return request(app)
            .get(`/api/notARoute`)
            .expect(404)
    })
})

describe('GET /api', ()=>{
    test('GET /api returns object of all available endpoints', ()=>{
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body})=>{
                const {endpoints} = body
                expect(endpoints).toEqual(apiEndpointsJSON)
            })
    })
})