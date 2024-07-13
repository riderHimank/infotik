import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { useDispatch } from 'react-redux'
import Scroller from '../components/Scroller';

export const UserPosts = ({ route }) => {

  const [change, setChange] = useState(false);
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setPosts(route.params.posts);
  }, [route.params.posts])

  const currentIndex = route.params.currentIndex;
  comingFromChat = route.params.comingFromChat;




  useEffect(() => {
    setChange(prev => !prev);
  }, [posts])
  return (
    <View>
      <Scroller posts={route.params.posts} currentIndex={currentIndex} change={change} profile={true} comingFromChat={comingFromChat} />
    </View>
  )
}
