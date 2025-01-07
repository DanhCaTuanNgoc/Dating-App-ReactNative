import React, { forwardRef, useImperativeHandle } from 'react'
import Swiper from 'react-native-deck-swiper'
import { StyleSheet, Platform } from 'react-native'
import { COLORS } from '@/constants/theme'

interface MatchingSwiperProps {
   matchingList: any[]
   renderCard: (card: any, cardIndex: number) => JSX.Element | null
   onSwipedLeft: (cardIndex: number) => void
   onSwipedRight: (cardIndex: number) => void
   swiperRef?: React.RefObject<Swiper<any>>
}

export interface MatchingSwiperRef {
   swipeLeft: () => void
   swipeRight: () => void
}

const MatchingSwiper = forwardRef<MatchingSwiperRef, MatchingSwiperProps>(
   ({ matchingList, renderCard, onSwipedLeft, onSwipedRight }, ref) => {
      const swiperRef = React.useRef<Swiper<any>>(null)

      useImperativeHandle(ref, () => ({
         swipeLeft: () => swiperRef.current?.swipeLeft(),
         swipeRight: () => swiperRef.current?.swipeRight(),
      }))

      return (
         <Swiper
            ref={swiperRef}
            cards={matchingList}
            renderCard={renderCard}
            cardHorizontalMargin={0}
            cardVerticalMargin={0}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            containerStyle={styles.swiper}
            backgroundColor="transparent"
            cardIndex={0}
            stackSize={3}
            stackSeparation={1}
            verticalSwipe={false}
            showSecondCard={true}
            animateCardOpacity={true}
            infinite={false}
            disableTopSwipe={true}
            disableBottomSwipe={true}
            swipeBackCard={true}
            overlayLabels={{
               left: {
                  title: 'NOPE',
                  style: {
                     label: styles.overlayLabel,
                     wrapper: styles.overlayWrapper,
                  },
               },
               right: {
                  title: 'LIKE',
                  style: {
                     label: {
                        ...styles.overlayLabel,
                        color: COLORS.heart,
                     },
                     wrapper: {
                        ...styles.overlayWrapper,
                        borderColor: COLORS.heart,
                     },
                  },
               },
            }}
         />
      )
   },
)

const styles = StyleSheet.create({
   swiper: {
      height: '52%',
      width: '92%',
   },
   overlayLabel: {
      fontSize: 45,
      fontWeight: 'bold',
      padding: 10,
      color: 'red',
   },
   overlayWrapper: {
      flexDirection: 'column',
      width: '92%',
      height: Platform.select({
         ios: '62%',
         android: '68%',
      }),
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      borderWidth: 3,
      borderColor: 'red',
      borderRadius: 30,
   },
})

export default MatchingSwiper
