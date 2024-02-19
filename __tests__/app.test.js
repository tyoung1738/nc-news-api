const app = require(`../app/app`)
const request = require('supertest')
const express = require('express')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

app.use(express.json())

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
})

describe("GET requests", ()=>{
    test("GET /api/topics - should return an array of objects", ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            body.forEach((topic)=>{
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