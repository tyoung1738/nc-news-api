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

describe('GET /api/articles/:article_id', ()=>{
    test('200 - returns object with correct properties', ()=>{
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
                        article_img_url: expect.any(String),
                    })
                })
            })
    test('200 - returns specified article with comment count now added', ()=>{
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body})=>{
                const {article} = body
                expect(article.article_id).toBe(1)
                expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.stringMatching(/\d+/)
                    })
                })
            })
    test("404 - should return error for valid but non-existent article id", ()=>{
        return request(app)
        .get('/api/articles/1000')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Resource not found")
        })
    })
    test("400 - should return error for invalid article id", ()=>{
        return request(app)
        .get('/api/articles/notanid')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })      
    })

describe("GET /api/articles", ()=>{
    test("200 - should return array of all articles if no query, sorted by created_at", ()=>{
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
                            article_img_url: expect.any(String),
                            comment_count: expect.stringMatching(/\d+/)
                        })
                    expect(article).not.toHaveProperty('body')
                })
                expect(articles).toBeSortedBy('created_at', {descending: true})
            })
    })
    test('200 - should provide array of articles filtered by topic query', ()=>{
        return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles.length).not.toBe(0)
                articles.forEach(article =>{
                    expect(article.topic).toBe('cats')

                    expect(article).toMatchObject(
                        {
                            author: expect.any(String),
                            title: expect.any(String),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String)
                        })
                    })
                
            })
    })
    test('200 - should provide empty array for valid topic query with no results', ()=>{
        return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles.length).toBe(0)   
            })
    })
    test('200 - should allow sort_by query', ()=>{
        return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles).toBeSortedBy('author', {descending: true})
            })
    })
    test('200 - should allow order by query', ()=>{
        return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles).toBeSortedBy('created_at', {descending: false})
            })
    })
    test('200 - should allow chaining of queries', ()=>{
        return request(app)
            .get('/api/articles?sort_by=author&topic=cats&order=asc')
            .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles).toBeSortedBy('author', {descending: false})
                articles.forEach((article)=>expect(article.topic).toBe('cats'))
            })
    })
    test('200 - should default to desc for invalid ORDER BY value', ()=>{
        return request(app)
            .get('/api/articles?order=bananas')
            .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles).toBeSortedBy('created_at', {descending: true})
            })
    })
    test('404 - should return err for invalid query', ()=>{
        return request(app)
            .get('/api/articles?bananas=yellow')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Resource not found")
            })
    })
    test('404 - should return err for valid query of invalid value - WHERE clause', ()=>{
        return request(app)
            .get('/api/articles?topic=bananas')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Resource not found")
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
    test('201 - should return added comment', ()=>{
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
    test('201 - should ignore unnecessary properties', ()=>{
        const input = {username: "rogersop", body: "I'm expecting 201", rogueProperty: "IM ROGUE"}
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
            expect(comment).not.toHaveProperty("rogueProperty")
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
    test("404 should return err for non-existent username", ()=>{
        const input = {username: "TY264", body: "Ha-ha"}
        return request(app)
        .post('/api/articles/2/comments')
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
    test('400 - should return err for missing required fields', ()=>{
        const input = {username: "rogersop"}
        return request(app)
        .post('/api/articles/2/comments')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe('PATCH /api/articles/:article_id', ()=>{
    test('200 - should return article with updated vote count - positive increment', ()=>{
        const input = {inc_votes: 109}
        return request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(200)
        .then(({body})=>{
            const {article} = body
            expect(article).toMatchObject(
                {
                    author: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                }
            )
            expect(article.article_id).toBe(3)
            expect(article.votes).toBe(109)
        })
    })
    test('200 - should return article with updated vote count - negative increment', ()=>{
        const input = {inc_votes: -15}
        return request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(200)
        .then(({body})=>{
            const {article} = body
            expect(article).toMatchObject(
                {
                    author: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                }
            )
            expect(article.article_id).toBe(3)
            expect(article.votes).toBe(-15)
        })
    })
    test('200 - should ignore additional properties on request and return updated article', ()=>{
        const input = {inc_votes: 12, rogueProperty: "IM ROGUE"}
        return request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(200)
        .then(({body})=>{
            const {article} = body
            expect(article).toMatchObject(
                {
                    author: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                }
            )
            expect(article.article_id).toBe(3)
            expect(article.votes).toBe(12)
            expect(article).not.toHaveProperty("rogueProperty")
        })
    })
    test('200 - should return original article unchanged for missing inc_votes property', ()=>{
        const input = {}
        return request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(200)
        .then(({body})=>{
            const {article} = body
            expect(article.votes).toBe(100)
            expect(article.article_id).toBe(1)
            expect(article).toMatchObject(
            {
                author: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
    })
    test('400 - should return err for invalid article_id', ()=>{
        const input = {inc_votes: 109}
        return request(app)
        .patch('/api/articles/notanid')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
    test('400 - should return err for invalid increment', ()=>{
        const input = {inc_votes: 'more'}
        return request(app)
        .patch('/api/articles/2')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
    test('404 - should return err for valid but non-existent article_id', ()=>{
        const input = {inc_votes: 109}
        return request(app)
        .patch('/api/articles/1000')
        .send(input)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Resource not found')
        })
    })
})

describe('DELETE /api/comments/:comment_id', ()=>{
    test('204 - should return no content', ()=>{
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({body})=>{
            expect(body).toEqual({})
        })
    })
    test('400 - should return err for invalid comment_id', ()=>{
        return request(app)
        .delete('/api/comments/notanid')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
        })
    })
    test('404 - should return err for non-existent but valid comment_id', ()=>{
        return request(app)
        .delete('/api/comments/1000')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Resource not found")
        })
    })
})

describe('PATCH /api/comments/:comment_id', ()=>{
    test('200 - responds with comment with updated vote ocunt - positive increment', ()=>{
        const input = {inc_votes: 3}
        return request(app)
            .patch('/api/comments/1')
            .send(input)
            .expect(200)
            .then(({body})=>{
                const {comment} = body
                expect(comment.comment_id).toBe(1)
                expect(comment.votes).toBe(19)
                expect(comment).toMatchObject({
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    created_at: expect.any(String)
                })    
            })
    })
    test('200 - should return comment with updated vote count - negative increment', ()=>{
        const input = {inc_votes: -15}
        return request(app)
        .patch('/api/comments/1')
        .send(input)
        .expect(200)
        .then(({body})=>{
            const {comment} = body
            expect(comment.comment_id).toBe(1)
            expect(comment.votes).toBe(1)
            expect(comment).toMatchObject({
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String)
            }) 
        })
    })
    test('200 - should ignore additional properties on request and return updated comment', ()=>{
        const input = {inc_votes: 12, rogueProperty: "IM ROGUE"}
        return request(app)
        .patch('/api/comments/1')
        .send(input)
        .expect(200)
        .then(({body})=>{
            const {comment} = body
            expect(comment.comment_id).toBe(1)
            expect(comment.votes).toBe(28)
            expect(comment).toMatchObject({
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String)
            }) 
            expect(comment).not.toHaveProperty("rogueProperty")
        })
    })
    test('200 - should return original comment unchanged for missing inc_votes property', ()=>{
        const input = {}
        return request(app)
        .patch('/api/comments/1')
        .send(input)
        .expect(200)
        .then(({body})=>{
            const {comment} = body
            expect(comment.comment_id).toBe(1)
            expect(comment.votes).toBe(16)
            expect(comment).toMatchObject({
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String)
            }) 
        })
    })
    test('400 - should return err for invalid comment_id', ()=>{
        const input = {inc_votes: 109}
        return request(app)
        .patch('/api/comments/notanid')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
    test('400 - should return err for invalid increment', ()=>{
        const input = {inc_votes: 'more'}
        return request(app)
        .patch('/api/comments/2')
        .send(input)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
    test('404 - should return err for valid but non-existent comment_id', ()=>{
        const input = {inc_votes: 109}
        return request(app)
        .patch('/api/comments/1000')
        .send(input)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Resource not found')
        })
    })
})

describe('GET /api/users', ()=>{
    test('200 - should respond with array of user objects', ()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            const {users} = body
            expect(users.length).toBe(4)
            users.forEach((user)=>{
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('GET /api/users/:username', ()=>{
    test('200 - responds with user object of username given', ()=>{
        return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then(({body})=>{
                const {user} = body
                expect(user.username).toBe('rogersop')
                expect(user).toMatchObject({
                    avatar_url: expect.any(String),
                    name: expect.any(String)
                })
            })
    })
    test('404 - returns err for non-existent username (no 400 assuming alpha-numeric usernames', ()=>{
        return request(app)
            .get('/api/users/asdf')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('Resource not found')
            })
    })
})



