const users = [
    {
        id: "1",
        name: "Marco",
        email: "Test@test.com",
        age: 36
    },
    {
        id: "2",
        name: "Keren",
        email: "keren@test.com"
    },
    {
        id: "3",
        name: "Ian",
        email: "Ian@test.com",
        age: 11
    }
]

const posts = [
    {
        id: "1",
        title: 'La barca cafe',
        body: 'Post body',
        published: false,
        author: "1"
    },
    {
        id: "2",
        title: 'El bulto de memo',
        body: 'Post 2 body',
        published: true,
        author: "2"
    },
    {
        id: "3",
        title: 'La nariz de pinguis',
        body: 'Post 3 body',
        published: false,
        author: "3"
    }
]

const comments = [
    {
        id: "1",
        text: "First comment",
        author: "3",
        post: "1"
    },
    {
        id: "2",
        text: "Second comment",
        author: "3",
        post: "2"
    },
    {
        id: "3",
        text: "Third comment",
        author: "1",
        post: "2"
    },
    {
        id: "4",
        text: "Fourth comment",
        author: "2",
        post: "1"
    },
]

const db = {
    users,
    posts,
    comments
}


export { db as default }