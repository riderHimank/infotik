import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import useMaterialNavBarHeight from '../hooks/useMaterialNavBarHeight';
import PostSingle from './post';

export default function Scroller({ posts: allPosts, change, profile, currentIndex, comingFromChat }) {
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

    const onViewableItemsChanged = useRef(({ changed, viewableItems }) => {
        if (Platform.OS === 'web') {
            changed.forEach(element => {
                // APPROACH 1
                // const cell = mediaRefs.current[element.key];
                // const viewable = viewableItems.find(item => item.isViewable);
                // console.log("Element", element)
                // console.log('Viewableitem', viewable.item);
                // console.log(viewableItems);
                // if (cell) {
                //     if (element.isViewable && isScrollTab.current) {
                //         // Stop all videos
                //         for (let index = 0; index < storeCellRef.current.length; index++) {
                //             const cell = storeCellRef.current[index];
                //             console.log('stopping');
                //             cell.stop();
                //         }
                //         // Clear the array
                //         storeCellRef.current = [];
                //         // Play the current video
                //         cell.play();
                //         currentVideoRes.current = cell;
                //         storeCellRef.current.push(cell);
                //     } else {
                //         cell.stop();
                //         console.log('stopping in else');
                //         // Remove the cell from the array
                //         storeCellRef.current = storeCellRef.current.filter(c => c !== cell);
                //     }
                // }

                // -ABOVE ONE PLAYS SIMULTANEOUSLY BELOW ONE DOESNT----------------------
                // APPROACH 2

                const viewable = viewableItems.find(item => item.isViewable);
                if (viewable) {
                    const cell = mediaRefs.current[viewable.item.id];
                    if (cell) {
                        console.log('cell', cell);
                        console.log('element', element);
                        console.log('viewableItems', viewableItems);
                        console.log(viewable);
                        // console.log('Viewableitem', viewable.item);
                        console.log(viewableItems);
                        for (let index = 0; index < storeCellRef.current.length; index++) {
                            console.log('stopping');
                            const cell = storeCellRef.current[index];
                            cell.stop();
                        }
                        // Stop the currently playing video if it's not the same as the new one

                        // Play the new video
                        cell.play();
                        // Update the ref to the currently playing video
                        currentVideoRes.current = cell;
                    }
                }
            });
        }
        else changed.forEach(element => {
            const cell = mediaRefs.current[element.key];
            console.log('cell', cell);
            console.log('element', element);
            console.log('viewableItems', viewableItems);
            if (cell) {
                if (element.isViewable && isScrollTab.current) {
                    // Stop all videos
                    for (let index = 0; index < storeCellRef.current.length; index++) {
                        const cell = storeCellRef.current[index];
                        console.log('stopping');
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
                    console.log('stopping in else');
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
                <PostSingle comingFromChat={comingFromChat} followedUsers={followedUsers}
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
                itemVisiblePercentThreshold: Platform.OS === 'web' ? 100 : 50
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
