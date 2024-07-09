import { View, Text, Dimensions, FlatList, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAllChats, getCurrentUserKeywords, getPost } from '../redux/actions/user'
import Scroller from '../components/Scroller'
import { Video, ResizeMode } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import tw from '../customtwrnc';
// import { FIREBASE_AUTH } from '../../firebaseConfig';

const ScrollScreen = () => {
  const { posts } = useSelector(store => store.user);
  const [change, setChange] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost());
    dispatch(getAllChats());
  }, [])

  useEffect(() => {
    console.log('change')
    setChange(prev => !prev);
  }, [posts])

  useEffect(() => {
    const filterPostsByKeywords = async () => {
      const keywords = await getCurrentUserKeywords();
      // Fetch the current user's keywords
      const filtered = posts.filter(post =>
        post.hashtags.some(hashtag => keywords.includes(hashtag))
        //  each post has a 'hashtags' array
      );
      // const shuffledFilteredPosts = shuffleArray(filtered);
      const limitedPosts = filtered.slice(0, 8);
      setFilteredPosts(filtered); //set to limitedPosts while testing
      console.log(`Filtered posts length: ${filtered.length}`);
    };


    if (posts.length > 0) {
      filterPostsByKeywords();
    }
  }, [posts]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  return (
    <View style={tw`flex flex-1`}>
      <Scroller posts={filteredPosts} change={change} profile={false} />
    </View>
  )
}

export default ScrollScreen