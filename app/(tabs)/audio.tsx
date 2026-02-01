import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import {
  ListMusic,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Playlist Data
const PLAYLIST = [
  {
    id: "1",
    title: "Love and Kindness",
    artist: "Dhamma Wisdom",
    category: "Meditation",
    duration: "4:32",
    source: require("../../assets/audio/love_and_kindness.mp3"),
    artwork:
      "https://images.unsplash.com/photo-1545389336-cf090b28b1b9?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Morning Chant",
    artist: "Metta Forest",
    category: "Chanting",
    duration: "6:15",
    source: require("../../assets/audio/vipasana/ဝိပဿနာသင်တန်းတရားတော်-၁.mp3"),
    artwork:
      "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w-400&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Breath Awareness",
    artist: "Vipassana",
    category: "Meditation",
    duration: "8:42",
    source: require("../../assets/audio/vipasana/ဝိပဿနာသင်တန်းတရားတော်-၂-အမေးအဖြေ.mp3"),
    artwork:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Mindfulness Practice",
    artist: "Dhamma Talks",
    category: "Teaching",
    duration: "12:30",
    source: require("../../assets/audio/love_and_kindness.mp3"),
    artwork:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  },
];

export default function AudioLibrary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // Initialize player with the first track
  const player = useAudioPlayer(PLAYLIST[currentIndex].source);
  const status = useAudioPlayerStatus(player);

  const currentTrack = PLAYLIST[currentIndex];

  // Set initial volume
  useEffect(() => {
    // player.volume(volume);
    player.volume = volume;
    // player.volume(volume);
  }, []);

  const playTrack = (index: number) => {
    setCurrentIndex(index);
    player.replace(PLAYLIST[index].source);
    player.play();
    setPlaylistVisible(false);
  };

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    playTrack(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    playTrack(prevIndex);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    // player.setVolume(value);
    // player.volume(value);
    player.volume = value;
  };

  const renderTrackItem = ({
    item,
    index,
  }: {
    item: (typeof PLAYLIST)[0];
    index: number;
  }) => {
    const isSelected = currentIndex === index;

    return (
      <TouchableOpacity
        style={[styles.trackItem, isSelected && styles.selectedTrack]}
        onPress={() => playTrack(index)}
      >
        <Image source={{ uri: item.artwork }} style={styles.trackArtwork} />

        <View style={styles.trackInfo}>
          <View style={styles.trackHeader}>
            <Text
              style={[styles.trackTitle, isSelected && styles.selectedText]}
            >
              {item.title}
            </Text>
            {isSelected && player.playing && (
              <View style={styles.playingIndicator}>
                <View style={styles.playingBar} />
                <View style={styles.playingBar} />
                <View style={styles.playingBar} />
              </View>
            )}
          </View>

          <Text style={styles.trackArtist}>{item.artist}</Text>

          <View style={styles.trackMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>

        <Music size={20} color={isSelected ? "#7C3AED" : "#9CA3AF"} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dhamma Audio</Text>
          <Text style={styles.headerSubtitle}>Meditations & Teachings</Text>
        </View>
        <TouchableOpacity
          style={styles.playlistButton}
          onPress={() => setPlaylistVisible(true)}
        >
          <ListMusic size={24} color="#7C3AED" />
          <Text style={styles.playlistButtonText}>Playlist</Text>
        </TouchableOpacity>
      </View>

      {/* Main Player */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Artwork */}
        <View style={styles.artworkContainer}>
          <LinearGradient
            colors={["#7C3AED", "#8B5CF6", "#A78BFA"]}
            style={styles.artworkGradient}
          >
            <Image
              source={{ uri: currentTrack.artwork }}
              style={styles.artwork}
            />
          </LinearGradient>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfoContainer}>
          <Text style={styles.currentTrackTitle}>{currentTrack.title}</Text>
          <Text style={styles.currentTrackArtist}>{currentTrack.artist}</Text>

          <View style={styles.trackMetaInfo}>
            <View style={styles.currentCategoryBadge}>
              <Text style={styles.currentCategoryText}>
                {currentTrack.category}
              </Text>
            </View>
            <Text style={styles.currentDurationText}>
              {currentTrack.duration}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>
              {formatTime(status.currentTime)}
            </Text>
            <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={status.duration || 1}
            value={status.currentTime}
            minimumTrackTintColor="#7C3AED"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#7C3AED"
            onSlidingComplete={(value) => player.seekTo(value)}
          />
        </View>

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <Volume2 size={20} color="#6B7280" />
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            minimumTrackTintColor="#7C3AED"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#7C3AED"
            onValueChange={handleVolumeChange}
          />
        </View>
      </ScrollView>

      {/* Player Controls */}
      <View style={styles.playerControls}>
        <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
          <SkipBack size={28} color="#4B5563" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
          <LinearGradient
            colors={["#7C3AED", "#8B5CF6"]}
            style={styles.playButtonGradient}
          >
            {player.playing ? (
              <Pause size={32} color="#FFFFFF" />
            ) : (
              <Play size={32} color="#FFFFFF" style={{ marginLeft: 4 }} />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
          <SkipForward size={28} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Playlist Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={playlistVisible}
        onRequestClose={() => setPlaylistVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setPlaylistVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Playlist</Text>
            <View style={{ width: 60 }} />
          </View>

          <FlatList
            data={PLAYLIST}
            renderItem={renderTrackItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalListContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Now Playing Bar in Modal */}
          <TouchableOpacity
            style={styles.nowPlayingBar}
            onPress={() => setPlaylistVisible(false)}
          >
            <Image
              source={{ uri: currentTrack.artwork }}
              style={styles.nowPlayingArtwork}
            />
            <View style={styles.nowPlayingInfo}>
              <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.nowPlayingArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.nowPlayingPlayButton}
            >
              {player.playing ? (
                <Pause size={20} color="#FFFFFF" />
              ) : (
                <Play size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  playlistButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playlistButtonText: {
    color: "#7C3AED",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },

  // Artwork
  artworkContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  artworkGradient: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },

  // Track Info
  trackInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  currentTrackTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 5,
  },
  currentTrackArtist: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 15,
  },
  trackMetaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentCategoryBadge: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  currentCategoryText: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "600",
  },
  currentDurationText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },

  // Progress Bar
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  timeText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 40,
  },

  // Volume Control
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },

  // Player Controls
  playerControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: "#FFFFFF",
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  playButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  // Playlist Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalListContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Track Item in Playlist
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedTrack: {
    backgroundColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
  trackArtwork: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  selectedText: {
    color: "#7C3AED",
  },
  trackArtist: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  trackMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  categoryBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "500",
  },
  durationText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  playingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    height: 16,
  },
  playingBar: {
    width: 3,
    height: 12,
    backgroundColor: "#7C3AED",
    marginHorizontal: 1.5,
    borderRadius: 1.5,
  },

  // Now Playing Bar in Modal
  nowPlayingBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  nowPlayingArtwork: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  nowPlayingInfo: {
    flex: 1,
    marginLeft: 15,
  },
  nowPlayingTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  nowPlayingArtist: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  nowPlayingPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
});
// import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
// import { Music, Pause, Play } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // 1. Your Playlist Data
// const PLAYLIST = [
//   {
//     id: "1",
//     title: "Love and Kindness",
//     artist: "Dhamma Wisdom",
//     source: require("../../assets/audio/love_and_kindness.mp3"),
//     artwork: "https://picsum.photos/seed/1/200/200",
//   },
//   {
//     id: "2",
//     title: "Morning Chant",
//     artist: "Metta Forest",
//     source: require("../../assets/audio/vipasana/ဝိပဿနာသင်တန်းတရားတော်-၁.mp3"),
//     artwork: "https://picsum.photos/seed/2/200/200",
//   },
//   {
//     id: "3",
//     title: "Breath Awareness",
//     artist: "Vipassana",
//     source: require("../../assets/audio/vipasana/ဝိပဿနာသင်တန်းတရားတော်-၂-အမေးအဖြေ.mp3"),
//     artwork: "https://picsum.photos/seed/3/200/200",
//   },
// ];

// export default function AudioLibrary() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Initialize player with the first track
//   const player = useAudioPlayer(PLAYLIST[currentIndex].source);
//   const status = useAudioPlayerStatus(player);

//   const currentTrack = PLAYLIST[currentIndex];

//   // 2. Function to play a specific track from the list
//   const playTrack = (index: number) => {
//     setCurrentIndex(index);
//     player.replace(PLAYLIST[index].source);
//     player.play();
//   };

//   const togglePlayPause = () => {
//     if (player.playing) {
//       player.pause();
//     } else {
//       player.play();
//     }
//   };

//   // 3. Render each item in the list
//   const renderTrackItem = ({
//     item,
//     index,
//   }: {
//     item: (typeof PLAYLIST)[0];
//     index: number;
//   }) => {
//     const isSelected = currentIndex === index;

//     return (
//       <TouchableOpacity
//         style={[styles.trackItem, isSelected && styles.selectedTrack]}
//         onPress={() => playTrack(index)}
//       >
//         <View style={styles.trackIndexContainer}>
//           {isSelected && player.playing ? (
//             <View style={styles.playingBars} /> // You could put a small animation here
//           ) : (
//             <Text style={styles.trackIndex}>{index + 1}</Text>
//           )}
//         </View>

//         <View style={styles.trackInfo}>
//           <Text style={[styles.trackTitle, isSelected && styles.selectedText]}>
//             {item.title}
//           </Text>
//           <Text style={styles.trackArtist}>{item.artist}</Text>
//         </View>

//         <Music size={20} color={isSelected ? "#6200ee" : "#ccc"} />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Dhamma Library</Text>

//       {/* THE LIST OF TRACKS */}
//       <FlatList
//         data={PLAYLIST}
//         renderItem={renderTrackItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//       />

//       {/* THE MINI PLAYER (Bottom Bar) */}
//       <View style={styles.miniPlayer}>
//         <Image
//           source={{ uri: currentTrack.artwork }}
//           style={styles.miniArtwork}
//         />

//         <View style={styles.miniInfo}>
//           <Text style={styles.miniTitle} numberOfLines={1}>
//             {currentTrack.title}
//           </Text>
//           <Text style={styles.miniArtist}>{currentTrack.artist}</Text>
//         </View>

//         <TouchableOpacity onPress={togglePlayPause} style={styles.mainPlayBtn}>
//           {player.playing ? (
//             <Pause size={28} color="#fff" fill="#fff" />
//           ) : (
//             <Play size={28} color="#fff" fill="#fff" />
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9fa" },
//   header: { fontSize: 24, fontWeight: "bold", padding: 20, color: "#1a1a1a" },
//   listContent: { paddingBottom: 100 }, // Space for the mini player

//   trackItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginHorizontal: 15,
//     marginBottom: 8,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   selectedTrack: {
//     backgroundColor: "#f0eaff",
//     borderColor: "#6200ee",
//     borderWidth: 1,
//   },
//   trackIndexContainer: { width: 30 },
//   trackIndex: { color: "#888", fontWeight: "600" },
//   trackInfo: { flex: 1, marginLeft: 10 },
//   trackTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
//   selectedText: { color: "#6200ee" },
//   trackArtist: { fontSize: 13, color: "#888", marginTop: 2 },

//   miniPlayer: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     height: 80,
//     backgroundColor: "#1a1a1a",
//     borderRadius: 40,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     elevation: 10,
//   },
//   miniArtwork: { width: 50, height: 50, borderRadius: 25 },
//   miniInfo: { flex: 1, marginLeft: 15 },
//   miniTitle: { color: "#fff", fontWeight: "bold", fontSize: 14 },
//   miniArtist: { color: "#aaa", fontSize: 12 },
//   mainPlayBtn: {
//     width: 50,
//     height: 50,
//     backgroundColor: "#6200ee",
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// // import { Colors } from "@/constants/theme";
// // import { useColorScheme } from "@/hooks/use-color-scheme";
// // import Slider from "@react-native-community/slider";
// // import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
// // import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
// // import React, { useState } from "react";
// // import {
// //   Dimensions,
// //   Image,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";

// // const { width } = Dimensions.get("window");

// // const PLAYLIST = [
// //   {
// //     id: "1",
// //     title: "Love and Kindness",
// //     artist: "Dhamma Wisdom",
// //     // Ensure this path is 100% correct relative to this file
// //     source: require("../../assets/audio/love_and_kindness.mp3"),
// //     artwork: "https://picsum.photos/seed/meditate/400/400",
// //   },
// //   {
// //     id: "2",
// //     title: "Morning Chant",
// //     artist: "Metta Forest",
// //     // source: require("../../assets/audio/morning_chant.mp3"),
// //     source: require("../../assets/audio/love_and_kindness.mp3"),
// //     artwork: "https://picsum.photos/seed/chant/400/400",
// //   },
// // ];

// // export default function AudioScreen() {
// //   const colorScheme = useColorScheme();
// //   const theme = Colors[colorScheme ?? "light"];
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   // Initialize the player with the first track
// //   const player = useAudioPlayer(PLAYLIST[currentIndex].source);
// //   const status = useAudioPlayerStatus(player);

// //   const handlePlayPause = () => {
// //     if (player.playing) {
// //       player.pause();
// //     } else {
// //       player.play();
// //     }
// //   };

// //   const handleNext = () => {
// //     const nextIndex = (currentIndex + 1) % PLAYLIST.length;
// //     setCurrentIndex(nextIndex);
// //     player.replace(PLAYLIST[nextIndex].source);
// //   };

// //   const handlePrevious = () => {
// //     const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
// //     setCurrentIndex(prevIndex);
// //     player.replace(PLAYLIST[prevIndex].source);
// //   };

// //   const formatTime = (ms: number) => {
// //     const totalSeconds = Math.floor(ms / 1000);
// //     const minutes = Math.floor(totalSeconds / 60);
// //     const seconds = totalSeconds % 60;
// //     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// //   };

// //   return (
// //     <SafeAreaView
// //       style={[styles.container, { backgroundColor: theme.background }]}
// //     >
// //       <View style={styles.header}>
// //         <Text style={[styles.headerTitle, { color: theme.text }]}>
// //           Dhamma Audio
// //         </Text>
// //       </View>

// //       <View style={styles.content}>
// //         <Image
// //           source={{ uri: PLAYLIST[currentIndex].artwork }}
// //           style={styles.artwork}
// //         />

// //         <View style={styles.infoContainer}>
// //           <Text style={[styles.trackTitle, { color: theme.text }]}>
// //             {PLAYLIST[currentIndex].title}
// //           </Text>
// //           <Text style={[styles.artistName, { color: theme.secondary }]}>
// //             {PLAYLIST[currentIndex].artist}
// //           </Text>
// //         </View>

// //         <View style={styles.sliderContainer}>
// //           <Slider
// //             style={styles.slider}
// //             minimumValue={0}
// //             maximumValue={status.duration || 1}
// //             value={status.currentTime}
// //             minimumTrackTintColor={theme.secondary}
// //             maximumTrackTintColor={theme.icon}
// //             thumbTintColor={theme.secondary}
// //             onSlidingComplete={(value) => player.seekTo(value)}
// //           />
// //           <View style={styles.timeRow}>
// //             <Text style={[styles.timeText, { color: theme.icon }]}>
// //               {formatTime(status.currentTime)}
// //             </Text>
// //             <Text style={[styles.timeText, { color: theme.icon }]}>
// //               {formatTime(status.duration)}
// //             </Text>
// //           </View>
// //         </View>

// //         <View style={styles.controls}>
// //           <TouchableOpacity onPress={handlePrevious}>
// //             <SkipBack size={32} color={theme.text} fill={theme.text} />
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={[styles.playButton, { backgroundColor: theme.secondary }]}
// //             onPress={handlePlayPause}
// //           >
// //             {player.playing ? (
// //               <Pause size={32} color="white" fill="white" />
// //             ) : (
// //               <Play
// //                 size={32}
// //                 color="white"
// //                 fill="white"
// //                 style={{ marginLeft: 4 }}
// //               />
// //             )}
// //           </TouchableOpacity>

// //           <TouchableOpacity onPress={handleNext}>
// //             <SkipForward size={32} color={theme.text} fill={theme.text} />
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   header: { padding: 20, alignItems: "center" },
// //   headerTitle: { fontSize: 16, fontWeight: "600", letterSpacing: 1 },
// //   content: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingHorizontal: 30,
// //   },
// //   artwork: {
// //     width: width * 0.7,
// //     height: width * 0.7,
// //     borderRadius: 20,
// //     marginBottom: 40,
// //   },
// //   infoContainer: { alignItems: "center", marginBottom: 30 },
// //   trackTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
// //   artistName: { fontSize: 18, marginTop: 5 },
// //   sliderContainer: { width: "100%", marginBottom: 30 },
// //   slider: { width: "100%", height: 40 },
// //   timeRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 5,
// //   },
// //   timeText: { fontSize: 12 },
// //   controls: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-around",
// //     width: "100%",
// //   },
// //   playButton: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// // });

// // // import { Colors } from "@/constants/theme"; // Using your theme
// // // import { useColorScheme } from "@/hooks/use-color-scheme";
// // // import Slider from "@react-native-community/slider";
// // // import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
// // // import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   Alert,
// // //   Dimensions,
// // //   Image,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // // } from "react-native";
// // // import { SafeAreaView } from "react-native-safe-area-context";

// // // const { width } = Dimensions.get("window");

// // // // Sample Playlist
// // // const PLAYLIST = [
// // //   {
// // //     id: "1",
// // //     title: "Morning Meditation",
// // //     artist: "Dhamma Wisdom",
// // //     url: "/assets/audio/love_and_kindness.mp3",
// // //     // url: (require('../../assets/audio/vipasana/ဝိပဿနာသင်တန်းတရားတော်-၁.mp3')),
// // //     // url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Replace with local require() or URLs
// // //     artwork: "https://picsum.photos/seed/meditate/400/400",
// // //   },
// // //   {
// // //     id: "2",
// // //     title: "Mindfulness Breath",
// // //     artist: "Metta Forest",
// // //     url: "../../assets/audio/love_and_kindness.mp3",
// // //     // url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
// // //     artwork: "https://picsum.photos/seed/breath/400/400",
// // //   },
// // // ];

// // // export default function AudioScreen() {
// // //   const colorScheme = useColorScheme();
// // //   const theme = Colors[colorScheme ?? "light"];

// // //   const [sound, setSound] = useState<Audio.Sound | null>(null);
// // //   const [isPlaying, setIsPlaying] = useState(false);
// // //   const [currentIndex, setCurrentIndex] = useState(0);
// // //   const [position, setPosition] = useState(0);
// // //   const [duration, setDuration] = useState(0);

// // //   const currentTrack = PLAYLIST[currentIndex];

// // //   useEffect(() => {
// // //     // Configure audio for background play and silent mode
// // //     Audio.setAudioModeAsync({
// // //       allowsRecordingIOS: false,
// // //       interruptionModeIOS: InterruptionModeIOS.DoNotMix,
// // //       playsInSilentModeIOS: true,
// // //       shouldDuckAndroid: true,
// // //       interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
// // //       stayActiveInBackground: true,
// // //     });

// // //     return () => {
// // //       if (sound) {
// // //         sound.unloadAsync();
// // //       }
// // //     };
// // //   }, [sound]);

// // //   // // Load and play audio
// // //   // async function loadAudio(index: number, autoPlay = true) {
// // //   //   if (sound) {
// // //   //     await sound.unloadAsync();
// // //   //   }

// // //   //   const { sound: newSound } = await Audio.Sound.createAsync(
// // //   //     { uri: PLAYLIST[index].url },
// // //   //     { shouldPlay: autoPlay },
// // //   //     onPlaybackStatusUpdate,
// // //   //   );

// // //   //   setSound(newSound);
// // //   //   setCurrentIndex(index);
// // //   //   setIsPlaying(autoPlay);
// // //   // }

// // //   async function loadAudio(index: number, autoPlay = true) {
// // //     if (sound) {
// // //       await sound.unloadAsync();
// // //     }

// // //     const source = PLAYLIST[index].url;

// // //     try {
// // //       const { sound: newSound } = await Audio.Sound.createAsync(
// // //         source, // Pass the required module or { uri: 'url' }
// // //         { shouldPlay: autoPlay },
// // //         onPlaybackStatusUpdate,
// // //       );

// // //       setSound(newSound);
// // //       setCurrentIndex(index);
// // //       setIsPlaying(autoPlay);
// // //     } catch (error) {
// // //       console.error("Error loading audio:", error);
// // //       Alert.alert("Error", "Could not play this audio file.");
// // //     }
// // //   }

// // //   const onPlaybackStatusUpdate = (status: any) => {
// // //     if (status.isLoaded) {
// // //       setPosition(status.positionMillis);
// // //       setDuration(status.durationMillis);
// // //       setIsPlaying(status.isPlaying);

// // //       if (status.didJustFinish) {
// // //         handleNext();
// // //       }
// // //     }
// // //   };

// // //   const handlePlayPause = async () => {
// // //     if (!sound) {
// // //       await loadAudio(currentIndex);
// // //     } else {
// // //       if (isPlaying) {
// // //         await sound.pauseAsync();
// // //       } else {
// // //         await sound.playAsync();
// // //       }
// // //     }
// // //   };

// // //   const handleNext = () => {
// // //     const nextIndex = (currentIndex + 1) % PLAYLIST.length;
// // //     loadAudio(nextIndex);
// // //   };

// // //   const handlePrevious = () => {
// // //     const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
// // //     loadAudio(prevIndex);
// // //   };

// // //   const onSliderValueChange = (value: number) => {
// // //     if (sound) {
// // //       sound.setPositionAsync(value);
// // //     }
// // //   };

// // //   const formatTime = (millis: number) => {
// // //     const minutes = Math.floor(millis / 60000);
// // //     const seconds = ((millis % 60000) / 1000).toFixed(0);
// // //     return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
// // //   };

// // //   return (
// // //     <SafeAreaView
// // //       style={[styles.container, { backgroundColor: theme.background }]}
// // //     >
// // //       <View style={styles.header}>
// // //         <Text style={[styles.headerTitle, { color: theme.text }]}>
// // //           Now Playing
// // //         </Text>
// // //       </View>

// // //       <View style={styles.content}>
// // //         {/* Artwork */}
// // //         <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />

// // //         {/* Info */}
// // //         <View style={styles.infoContainer}>
// // //           <Text style={[styles.trackTitle, { color: theme.text }]}>
// // //             {currentTrack.title}
// // //           </Text>
// // //           <Text style={[styles.artistName, { color: theme.secondary }]}>
// // //             {currentTrack.artist}
// // //           </Text>
// // //         </View>

// // //         {/* Slider */}
// // //         <View style={styles.sliderContainer}>
// // //           <Slider
// // //             style={styles.slider}
// // //             minimumValue={0}
// // //             maximumValue={duration}
// // //             value={position}
// // //             minimumTrackTintColor={theme.secondary}
// // //             maximumTrackTintColor={theme.icon}
// // //             thumbTintColor={theme.secondary}
// // //             onSlidingComplete={onSliderValueChange}
// // //           />
// // //           <View style={styles.timeRow}>
// // //             <Text style={[styles.timeText, { color: theme.icon }]}>
// // //               {formatTime(position)}
// // //             </Text>
// // //             <Text style={[styles.timeText, { color: theme.icon }]}>
// // //               {formatTime(duration)}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         {/* Controls */}
// // //         <View style={styles.controls}>
// // //           <TouchableOpacity onPress={handlePrevious}>
// // //             <SkipBack size={32} color={theme.text} fill={theme.text} />
// // //           </TouchableOpacity>

// // //           <TouchableOpacity
// // //             style={[styles.playButton, { backgroundColor: theme.secondary }]}
// // //             onPress={handlePlayPause}
// // //           >
// // //             {isPlaying ? (
// // //               <Pause size={32} color="white" fill="white" />
// // //             ) : (
// // //               <Play
// // //                 size={32}
// // //                 color="white"
// // //                 fill="white"
// // //                 style={{ marginLeft: 4 }}
// // //               />
// // //             )}
// // //           </TouchableOpacity>

// // //           <TouchableOpacity onPress={handleNext}>
// // //             <SkipForward size={32} color={theme.text} fill={theme.text} />
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   header: { padding: 20, alignItems: "center" },
// // //   headerTitle: {
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //     textTransform: "uppercase",
// // //     letterSpacing: 1,
// // //   },
// // //   content: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     paddingHorizontal: 30,
// // //   },
// // //   artwork: {
// // //     width: width * 0.8,
// // //     height: width * 0.8,
// // //     borderRadius: 20,
// // //     marginBottom: 40,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 10 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 15,
// // //   },
// // //   infoContainer: { alignItems: "center", marginBottom: 30 },
// // //   trackTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
// // //   artistName: { fontSize: 18, marginTop: 5 },
// // //   sliderContainer: { width: "100%", marginBottom: 30 },
// // //   slider: { width: "100%", height: 40 },
// // //   timeRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     paddingHorizontal: 5,
// // //   },
// // //   timeText: { fontSize: 12 },
// // //   controls: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     width: "70%",
// // //   },
// // //   playButton: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     elevation: 5,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //   },
// // // });
