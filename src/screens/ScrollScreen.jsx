import { View, Text, Dimensions, FlatList, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getCurrentUserKeywords, getPost } from '../redux/actions/user'
import Scroller from '../components/Scroller'
import { Video, ResizeMode } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';

const ScrollScreen = () => {
  const { posts } = useSelector(store => store.user);
  const [change, setChange] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    (
      async function () {
        dispatch(getPost());
      }
    )()
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
      setFilteredPosts(filtered);
      console.log(`Filtered posts length: ${filtered.length}`);
    };


    if (posts.length > 0) {
      filterPostsByKeywords();
    }
  }, [posts]);
  return (
    <View>
      <Scroller posts={filteredPosts} change={change} profile={false} />
    </View>
  )
}

export default ScrollScreen