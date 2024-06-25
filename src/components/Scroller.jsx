import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import useMaterialNavBarHeight from '../hooks/useMaterialNavBarHeight';
import PostSingle from './post';

export default function Scroller({ posts: allPosts, change, profile, currentIndex }) {
    const [posts, setPosts] = useState(allPosts);
    const isScrollTab = useRef(true);
    const mediaRefs = useRef([]);
    const storeCellRef = useRef([]);
    const currentVideoRes = useRef(null);
    const navigation = useNavigation();

    const { change: pageChange } = useSelector(store => store.user);

    useEffect(() => {
        setPosts(allPosts);
    }, [allPosts, change]);

    useEffect(() => {
        console.log('mount');
    }, [pageChange]);

    useEffect(() => {
        const handleScreenChange = () => {
            if (currentVideoRes.current) currentVideoRes.current.stop();
            isScrollTab.current = false;
        };

        const handleFocus = () => {
            isScrollTab.current = true;
            if (currentVideoRes.current) currentVideoRes.current.play();
        };

        const unsubscribeBlur = navigation.addListener('blur', handleScreenChange);
        const unsubscribeFocus = navigation.addListener('focus', handleFocus);

        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);

    const onViewableItemsChanged = useRef(({ changed }) => {
        changed.forEach(element => {
            const cell = mediaRefs.current[element.key];
            if (cell) {
                if (element.isViewable && isScrollTab.current) {
                    // Stop all videos
                    for (let index = 0; index < storeCellRef.current.length; index++) {
                        const cell = storeCellRef.current[index];
                        cell.stop();
                    }
                    // Clear the array
                    storeCellRef.current = [];
                    // Play the current video
                    cell.play();
                    currentVideoRes.current = cell;
                    storeCellRef.current.push(cell);
                } else {
                    cell.stop();
                    // Remove the cell from the array
                    storeCellRef.current = storeCellRef.current.filter(c => c !== cell);
                }
            }
        });
    });

    const feedItemHeight = Dimensions.get('window').height - useMaterialNavBarHeight(profile);

    const [followedUsers, setFollowedUsers] = useState(new Set());
    const renderItem = ({ item, index }) => {
        return (
            <View style={{ height: feedItemHeight, backgroundColor: 'black' }}>
                <PostSingle followedUsers={followedUsers}
                    setFollowedUsers={setFollowedUsers} item={item} key={item.id} ref={ref => (mediaRefs.current[item.id] = ref)} />
            </View>
        );
    };

    const handleEndReach = () => {
        setPosts(prevPosts => [...prevPosts, ...allPosts]);
    }

    return (
        <FlatList
            windowSize={4}
            height={feedItemHeight}
            data={posts}
            initialScrollIndex={currentIndex}
            renderItem={renderItem}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            removeClippedSubviews
            viewabilityConfig={{
                itemVisiblePercentThreshold: 50
            }}
            pagingEnabled
            decelerationRate={'normal'}
            onViewableItemsChanged={onViewableItemsChanged.current} /*
            to fix the audio leak bug
            */
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onEndReached={handleEndReach}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 }
});
