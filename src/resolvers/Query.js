const Query =  {
    me(){
        return {
            id: '12324556',
            name: 'Marco',
            email: 'Marco@example.com'
        }
    },
    post(){
       return {
           id: 'abocjsdafakhfdkf',
           title: 'My trip to Europe',
           body: 'Venice canal',
           published: false
       }
    },
    users(parent, args, { db } , info){
        const { query } = args
        return query ? db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()) ) : db.users
    },
    posts(parent, args, { db }, info){
        const { query } = args 
        return query 
        ? db.posts.filter(post => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)) 
        : db.posts   
     },
     comments(parent, args, { db }, info){
         return db.comments
     }
 }
 export { Query as default }