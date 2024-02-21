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

describe("GET requests - invalid routes", ()=>{
    test("404 should return err for no matching endpoint under api", ()=>{
        return request(app)
            .get('/api/articlez')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Not found")
            })
    })
    test("404 should return not found for invalid request not under /api", ()=>{
        return request(app)
            .get(`/nowhere`)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Not found")
            })
    })
})

describe("GET /api/topics", ()=>{
    test("should return an array of objects with properties 'slug' and 'description'", ()=>{
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
                expect(body.msg).toBe("Resource not found")
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
    })

    describe("GET /api/articles/:article_id/comments", ()=>{
        test("should return array of comments for given article_id", ()=>{
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body})=>{
                const {comments} = body
                expect(comments.length > 0).toBe(true)
                //check contents for desired properties
                comments.forEach((comment)=>{
                    expect(comment.article_id).toBe(1)

                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String)
                    })
                })
                //check contents for desired order
                expect(comments).toBeSortedBy('created_at', {descending: true})
            })
        })
        test("404 should return error for valid but non-existent article id", ()=>{
            return request(app)
            .get('/api/articles/1000/comments')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Resource not found")
            })
        })
        test("400 should return error for invalid article id", ()=>{
            return request(app)
            .get('/api/articles/notanid/comments')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('Bad request')
            })
        })
        test("200 should return 200 empty array for valid article id with no comments", ()=>{
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({body})=>{
                    const {comments} = body
                    expect(comments.length).toBe(0)
                })
        })   
    })

    describe('POST /api/articles/:article_id/comments', ()=>{
        test('should return added comment', ()=>{
            const input = {username: "rogersop", body: "Ha-ha"}
            return request(app)
                .post('/api/articles/2/comments')
                .send(input)
                .expect(201)
                .then(({body})=>{
                    const {comment} = body
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String)
                        })
                    expect(comment.article_id).toBe(2)
                    expect(comment.votes).toBe(0)
                    })
            })
        test("404 should return error for valid but non-existent article id", ()=>{
            const input = {username: "rogersop", body: "Ha-ha"}
            return request(app)
            .post('/api/articles/1000/comments')
            .send(input)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Not found")
            })
        })
        test("400 should return error for invalid article id", ()=>{
            const input = {username: "rogersop", body: "Ha-ha"}
            return request(app)
            .post('/api/articles/notanid/comments')
            .send(input)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('Bad request')
            })
        })

    })