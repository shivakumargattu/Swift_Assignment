import { getDb } from '../config/db';
import { User, Post, Comment } from '../models/user';
import axios from 'axios';

export async function loadUsers(): Promise<void> {
  const db = getDb();
  const usersCollection = db.collection<User>('users');
  const postsCollection = db.collection<Post>('posts');
  const commentsCollection = db.collection<Comment>('comments');

  try {
    console.log("Starting to load users..."); 
    const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users: User[] = usersResponse.data;
    console.log(`Retrieved ${users.length} users from JSONPlaceholder.`); 

    for (const user of users) {
      console.log(`Processing user: ${user.id}`);
      const postsResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
      const posts: Post[] = postsResponse.data;
      user.posts = posts;
      console.log(`Retrieved ${posts.length} posts for user ${user.id}`); 
      await usersCollection.insertOne(user);

      for (const post of posts) {
        const commentsResponse = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
        const comments: Comment[] = commentsResponse.data;
        post.comments = comments;
        console.log(`Retrieved ${comments.length} comments for post ${post.id}`);
        await postsCollection.insertOne(post);
        for (const comment of comments) {
          await commentsCollection.insertOne(comment);
        }
      }
    }
    console.log("User loading completed."); // Added log
  } catch (error) {
    console.error('Error loading users:', error);
    throw error;
  }
}

export async function deleteUsers(): Promise<void> {
  const db = getDb();
  const usersCollection = db.collection('users');
  await usersCollection.deleteMany({});
}

export async function deleteUser(userId: number): Promise<void> {
  const db = getDb();
  const usersCollection = db.collection('users');
  await usersCollection.deleteOne({ id: userId });
}

export async function getUser(userId: number): Promise<User | null> {
  const db = getDb();
  const usersCollection = db.collection<User>('users');
  const user = await usersCollection.findOne({ id: userId });
  return user;
}

export async function putUser(user: User): Promise<void> {
  const db = getDb();
  const usersCollection = db.collection<User>('users');
  const existingUser = await usersCollection.findOne({ id: user.id });
  if (existingUser) {
    throw new Error("User already exists");
  }
  await usersCollection.insertOne(user);
}