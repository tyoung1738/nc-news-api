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
            expect(topics.length === 0).toBe(false)
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
            .then(({body})=>{
                expect(body.msg).toBe("Not found")
            })
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

describe('GET /api/articles/:articleID', ()=>{
    test('returns object with correct properties', ()=>{
        return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({body})=>{
                const {article} = body
                
                expect(article.article_id).toBe(2)

                expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    })
                })
            })
        test("should return error for valid but non-existent article id", ()=>{
            return request(app)
            .get('/api/articles/1000')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Not found")
            })
        })
        test("should return error for invalid article id", ()=>{
            return request(app)
            .get('/api/articles/notanid')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('Bad request')
            })
        })      
    })

    describe("GET /api/articles", ()=>{
        test("should return array of all articles", ()=>{
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body})=>{
                    const {articles} = body
                    expect(articles.length === 13).toBe(true)
                    articles.forEach((article)=>{
                        expect(article).toMatchObject(
                            {
                                author: expect.any(String),
                                title: expect.any(String),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                article_img_url: expect.any(String)
                            })
                        expect(article).not.toHaveProperty('body')
                    })
                    expect(articles).toBeSortedBy('created_at', {descending: true})
                })
        })
        test("should return err for no matching endpoint", ()=>{
            return request(app)
                .get('/api/articlez')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe("Not found")
                })
        })
    })