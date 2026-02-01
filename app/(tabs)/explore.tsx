import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import {
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  Mail,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

// Define Book type
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  pages?: number;
  language: string;
  source: any;
  type: "text" | "pdf";
  size?: string;
}

// Sample Book Data
const BOOKS: Book[] = [
  {
    id: "1",
    title: "Only One Way!",
    author: "Dhamma Wisdom",
    description:
      "A comprehensive guide to Vipassana meditation practice with detailed instructions and insights.",
    category: "Meditation",
    pages: 128,
    language: "English",
    source: require("../../assets/books/only_one_way.pdf"),
    type: "pdf",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "The Four Noble Truths",
    author: "Buddhist Teachings",
    description:
      "Detailed explanation of the Four Noble Truths, the foundation of Buddhist philosophy.",
    category: "Philosophy",
    pages: 64,
    language: "English",
    source: `The Four Noble Truths form the foundation of Buddhist teaching. They are:

1. The Truth of Suffering (Dukkha)
   Life inherently involves suffering, dissatisfaction, and imperfection. Even moments of happiness are temporary and subject to change.

2. The Truth of the Cause of Suffering (Samudaya)
   Suffering arises from craving, attachment, and ignorance. We suffer because we cling to impermanent things.

3. The Truth of the End of Suffering (Nirodha)
   It is possible to end suffering by eliminating craving and attachment. This state of liberation is called Nirvana.

4. The Truth of the Path (Magga)
   The Noble Eightfold Path leads to the end of suffering. This path consists of right understanding, right thought, right speech, right action, right livelihood, right effort, right mindfulness, and right concentration.

These truths are not pessimistic but practical guidelines for understanding and overcoming the fundamental dissatisfactions of human existence.`,
    type: "text",
    size: "15 KB",
  },
  {
    id: "3",
    title: "Mindfulness of Breathing",
    author: "Ancient Teachings",
    description:
      "Step-by-step instructions on Anapanasati meditation for developing mindfulness.",
    category: "Meditation",
    pages: 96,
    language: "English",
    source: require("../../assets/books/handbook.pdf"),
    type: "pdf",
    size: "1.8 MB",
  },
  {
    id: "4",
    title: "Metta (Loving-Kindness)",
    author: "Compassion Practice",
    description:
      "Guide to developing loving-kindness meditation for personal and interpersonal harmony.",
    category: "Compassion",
    pages: 48,
    language: "English",
    source: `Metta (Loving-Kindness) Meditation Practice

Introduction:
Metta meditation is the practice of cultivating unconditional love and kindness toward all beings. It begins with developing loving-kindness toward yourself and gradually extends to others.

Practice Steps:

1. Begin with Yourself
   Sit comfortably and repeat silently:
   "May I be happy. May I be healthy. May I be safe. May I live with ease."

2. Extend to a Benefactor
   Think of someone who has helped you:
   "May you be happy. May you be healthy. May you be safe. May you live with ease."

3. Extend to a Friend
   "May you be happy. May you be healthy. May you be safe. May you live with ease."

4. Extend to a Neutral Person
   Someone you see regularly but don't know well.

5. Extend to a Difficult Person
   Someone you have conflict with (be gentle with this step).

6. Extend to All Beings
   "May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease."

Benefits:
• Reduces anger and resentment
• Increases compassion
• Improves relationships
• Cultivates inner peace

Practice this daily for 10-20 minutes.`,
    type: "text",
    size: "12 KB",
  },
];

export default function BookScreen() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const openBook = async (book: Book) => {
    setSelectedBook(book);
    setLoading(true);

    if (book.type === "pdf") {
      try {
        // Load PDF asset
        const asset = Asset.fromModule(book.source);
        await asset.downloadAsync();
        const uri = asset.localUri || asset.uri;
        setPdfUri(uri);
        setModalVisible(true);
      } catch (error) {
        console.error("Error loading PDF:", error);
        // Alert.alert(
        //   "Error Loading PDF",
        //   "The book couldn't be loaded. Please use the download request option.",
        //   [
        //     { text: "OK" },
        //     {
        //       text: "Request Download",
        //       onPress: () => handleRequestDownload(book),
        //     },
        //   ],
        // );
      } finally {
        setLoading(false);
      }
    } else {
      // For text books
      setModalVisible(true);
      setLoading(false);
    }
  };

  const handleRequestDownload = (book?: Book) => {
    const targetBook = book || selectedBook;
    if (!targetBook) return;

    Alert.alert(
      "Request Download",
      `Would you like to request a downloadable copy of "${targetBook.title}"?`,
      [
        {
          text: "Email Request",
          onPress: () => sendDownloadRequest(targetBook),
        },
        {
          text: "Share Info",
          onPress: () => shareBookInfo(targetBook),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  const sendDownloadRequest = (book: Book) => {
    const subject = `Book Download Request: ${book.title}`;
    const body =
      `Dear Dhamma Library,\n\nI would like to request a downloadable copy of the following book:\n\n` +
      `Title: ${book.title}\n` +
      `Author: ${book.author}\n` +
      `Category: ${book.category}\n` +
      `Language: ${book.language}\n\n` +
      `Please let me know how I can obtain a copy for offline reading.\n\n` +
      `Thank you,\n[Your Name]`;

    Linking.openURL(
      `mailto:htoomyatnyinyi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const shareBookInfo = async (book: Book) => {
    const message =
      `Check out this Dhamma book: "${book.title}" by ${book.author}\n\n` +
      `Description: ${book.description}\n\n` +
      `Available for reading in the Dhamma Library app.`;

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync({
        message,
        title: `Book: ${book.title}`,
      });
    } else {
      Alert.alert(
        "Sharing not available",
        "Please copy the information manually.",
      );
    }
  };

  const renderPDFViewer = () => {
    if (!pdfUri || !selectedBook) {
      return (
        <View style={styles.placeholderContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.placeholderText}>Loading book...</Text>
        </View>
      );
    }

    return (
      <View style={styles.pdfContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: pdfUri }}
          style={styles.webview}
          originWhitelist={["*"]}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(error) => {
            console.error("WebView error:", error);
            Alert.alert(
              "Preview Not Available",
              "Please use the download request option to read this book.",
              [
                { text: "OK" },
                {
                  text: "Request Download",
                  onPress: () => handleRequestDownload(),
                },
              ],
            );
          }}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
          )}
        />
      </View>
    );
  };

  const renderBookCard = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => openBook(item)}
      onLongPress={() => handleRequestDownload(item)}
    >
      <LinearGradient
        colors={
          item.type === "pdf" ? ["#7C3AED", "#8B5CF6"] : ["#10B981", "#34D399"]
        }
        style={styles.bookIconContainer}
      >
        {item.type === "pdf" ? (
          <FileText size={28} color="#FFFFFF" />
        ) : (
          <BookOpen size={28} color="#FFFFFF" />
        )}
      </LinearGradient>

      <View style={styles.bookInfo}>
        <View style={styles.bookHeader}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: item.type === "pdf" ? "#F5F3FF" : "#F0FDF4" },
            ]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                { color: item.type === "pdf" ? "#7C3AED" : "#10B981" },
              ]}
            >
              {item.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.bookAuthor}>By {item.author}</Text>

        <Text style={styles.bookDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bookMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Category:</Text>
            <Text style={styles.metaValue}>{item.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Size:</Text>
            <Text style={styles.metaValue}>{item.size}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Text style={styles.readButtonText}>
            Tap to read {item.type === "pdf" ? "(Preview)" : ""}
          </Text>
          <ChevronRight size={16} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#7C3AED", "#8B5CF6"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dhamma Library</Text>
            <Text style={styles.headerSubtitle}>
              Sacred texts, meditation guides, and teachings
            </Text>
          </View>
          <TouchableOpacity
            style={styles.downloadInfoButton}
            onPress={() => setShowDownloadOptions(!showDownloadOptions)}
          >
            <Download size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {showDownloadOptions && (
          <View style={styles.downloadInfoPanel}>
            <Text style={styles.downloadInfoTitle}>Download Information</Text>
            <Text style={styles.downloadInfoText}>
              • Text books can be read directly in the app • PDF books can be
              previewed or downloaded upon request • Long press any book to
              request download • All requests will be processed via email
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Book List */}
      <FlatList
        data={BOOKS}
        keyExtractor={(item) => item.id}
        renderItem={renderBookCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Reading Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setPdfUri(null);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={["#7C3AED", "#8B5CF6"]}
            style={styles.modalHeaderGradient}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setPdfUri(null);
                }}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>

              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedBook?.title}
                </Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {selectedBook?.author}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleRequestDownload()}
                style={styles.modalDownloadButton}
              >
                <Mail size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Book Content */}
          {selectedBook?.type === "pdf" ? (
            renderPDFViewer()
          ) : (
            <ScrollView style={styles.textContainer}>
              <View style={styles.textContent}>
                <Text style={styles.bookText}>{selectedBook?.source}</Text>
              </View>
            </ScrollView>
          )}

          {/* Download Request Banner */}
          <View style={styles.requestBanner}>
            <View style={styles.requestBannerContent}>
              <Download size={20} color="#7C3AED" />
              <View style={styles.requestBannerTextContainer}>
                <Text style={styles.requestBannerTitle}>
                  Want to read offline?
                </Text>
                <Text style={styles.requestBannerDescription}>
                  Request a downloadable copy for offline reading
                </Text>
              </View>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => handleRequestDownload()}
              >
                <Text style={styles.requestButtonText}>Request</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
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

  // Header Styles
  headerGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
    elevation: 5,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E9D5FF",
    opacity: 0.9,
  },
  downloadInfoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadInfoPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  downloadInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  downloadInfoText: {
    fontSize: 13,
    color: "#E9D5FF",
    lineHeight: 20,
  },

  // Book List Styles
  listContainer: {
    padding: 16,
    paddingTop: 20,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  bookIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  bookMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  readButtonText: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeaderGradient: {
    paddingTop: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#E9D5FF",
    textAlign: "center",
    marginTop: 2,
  },
  modalDownloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // PDF Viewer Styles
  pdfContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
  },

  // Text Content Styles
  textContainer: {
    flex: 1,
  },
  textContent: {
    padding: 24,
  },
  bookText: {
    fontSize: 16,
    lineHeight: 28,
    color: "#374151",
    textAlign: "justify",
  },

  // Request Banner
  requestBanner: {
    padding: 16,
    backgroundColor: "#F5F3FF",
    borderTopWidth: 1,
    borderTopColor: "#DDD6FE",
  },
  requestBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  requestBannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  requestBannerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7C3AED",
    marginBottom: 2,
  },
  requestBannerDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  requestButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  requestButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Loading States
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
});
// import { Asset } from "expo-asset";
// import * as Linking from "expo-linking";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Modal,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { WebView } from "react-native-webview";

// // Define the Book type
// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   source: any;
//   type: "text" | "pdf";
//   description?: string;
// }

// const BOOKS: Book[] = [
//   {
//     id: "1",
//     title: "Only One Way!",
//     author: "Dhamma Wisdom",
//     description: "Instruction on Vipassana meditation.",
//     source: require("../../assets/books/only_one_way.pdf"),
//     type: "pdf",
//   },
//   {
//     id: "2",
//     title: "Short Story",
//     author: "Unknown",
//     description: "A sample story for reading.",
//     source:
//       "This is a sample text book content. You can read it directly here in the app without needing to download any external files. Enjoy your reading!",
//     type: "text",
//   },
//   {
//     id: "3",
//     title: "Meditation Guide",
//     author: "Buddhist Monks",
//     description: "Step-by-step meditation instructions.",
//     source: require("../../assets/books/handbook.pdf"),
//     type: "pdf",
//   },
// ];

// export default function BookScreen() {
//   const [selectedBook, setSelectedBook] = useState<Book | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [pdfUri, setPdfUri] = useState<string | null>(null);

//   const openBook = async (book: Book) => {
//     setSelectedBook(book);
//     setLoading(true);

//     if (book.type === "pdf") {
//       try {
//         // Load the PDF asset
//         const asset = Asset.fromModule(book.source);
//         await asset.downloadAsync();
//         const uri = asset.localUri || asset.uri;
//         setPdfUri(uri);
//         setModalVisible(true);
//       } catch (error) {
//         console.error("Error loading PDF:", error);
//         Alert.alert(
//           "Error",
//           "Could not load the PDF file. Please try again or request a download.",
//         );
//         setLoading(false);
//         return;
//       }
//     } else {
//       // For text books, open modal immediately
//       setModalVisible(true);
//     }

//     setLoading(false);
//   };

//   const handleRequestDownload = () => {
//     Alert.alert(
//       "Request Download",
//       "Would you like to request a downloadable copy of this book?",
//       [
//         {
//           text: "Email Request",
//           onPress: () => {
//             const subject = `Download Request: ${selectedBook?.title}`;
//             const body = `Hello,\n\nI would like to request a downloadable copy of "${selectedBook?.title}" by ${selectedBook?.author}.\n\nThank you!`;
//             Linking.openURL(
//               `mailto:htoomyatnyinyi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
//             );
//           },
//         },
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//       ],
//     );
//   };

//   const renderPdfViewer = () => {
//     if (!pdfUri || !selectedBook) {
//       return (
//         <View style={styles.placeholderContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.placeholderText}>Loading PDF...</Text>
//         </View>
//       );
//     }

//     // Create a data URL for the PDF
//     // Note: This works for iOS WebView. For Android, we might need a different approach
//     const pdfDataUrl = `data:application/pdf;base64,${pdfUri}`;

//     console.log(pdfDataUrl, "pdfurl");
//     // For iOS, use WebView with data URL
//     if (Platform.OS === "ios") {
//       return (
//         <WebView
//           source={{ uri: pdfUri }}
//           style={styles.webview}
//           originWhitelist={["*"]}
//           onLoadStart={() => setLoading(true)}
//           onLoadEnd={() => setLoading(false)}
//           onError={(error) => {
//             console.error("WebView error:", error);
//             Alert.alert(
//               "Preview Not Available",
//               "The PDF preview is not available. Please use the download request option.",
//             );
//           }}
//           startInLoadingState={true}
//           renderLoading={() => (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#007AFF" />
//             </View>
//           )}
//         />
//       );
//     }

//     // For Android, we'll show a message and download option
//     return (
//       <View style={styles.androidPdfContainer}>
//         <View style={styles.pdfMessageContainer}>
//           <Text style={styles.pdfMessageTitle}>PDF Preview</Text>
//           <Text style={styles.pdfMessageText}>
//             For the best reading experience on Android, please use the download
//             request option below to get a copy of this PDF.
//           </Text>
//           <TouchableOpacity
//             style={styles.downloadRequestButton}
//             onPress={handleRequestDownload}
//           >
//             <Text style={styles.downloadRequestButtonText}>
//               Request Download
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const renderBookItem = ({ item }: { item: Book }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => openBook(item)}
//       disabled={loading}
//     >
//       <View style={styles.bookHeader}>
//         <Text style={styles.title}>{item.title}</Text>
//         <View
//           style={[
//             styles.badge,
//             item.type === "pdf" ? styles.pdfBadge : styles.textBadge,
//           ]}
//         >
//           <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
//         </View>
//       </View>
//       <Text style={styles.author}>By {item.author}</Text>
//       {item.description && (
//         <Text style={styles.description} numberOfLines={2}>
//           {item.description}
//         </Text>
//       )}
//       {item.type === "pdf" && (
//         <Text style={styles.pdfNote}>Tap to preview • Download available</Text>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>Dhamma Library</Text>
//         <Text style={styles.subHeader}>
//           Read sacred texts and meditation guides
//         </Text>
//       </View>

//       <FlatList
//         data={BOOKS}
//         keyExtractor={(item) => item.id}
//         renderItem={renderBookItem}
//         contentContainerStyle={styles.list}
//       />

//       <Modal
//         animationType="slide"
//         transparent={false}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//           setPdfUri(null);
//         }}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => {
//                 setModalVisible(false);
//                 setPdfUri(null);
//               }}
//             >
//               <Text style={styles.closeButtonText}>✕ Close</Text>
//             </TouchableOpacity>

//             <View style={styles.modalTitleContainer}>
//               <Text style={styles.modalTitle} numberOfLines={1}>
//                 {selectedBook?.title}
//               </Text>
//               <Text style={styles.modalAuthor} numberOfLines={1}>
//                 {selectedBook?.author}
//               </Text>
//             </View>

//             {selectedBook?.type === "pdf" && (
//               <TouchableOpacity
//                 style={styles.downloadButton}
//                 onPress={handleRequestDownload}
//               >
//                 <Text style={styles.downloadButtonText}>Request</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {selectedBook?.type === "pdf" ? (
//             <View style={styles.pdfContainer}>
//               {renderPdfViewer()}

//               {/* Download Request Banner */}
//               <View style={styles.requestBanner}>
//                 <Text style={styles.requestBannerText}>
//                   Want to save this book for offline reading?
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.requestBannerButton}
//                   onPress={handleRequestDownload}
//                 >
//                   <Text style={styles.requestBannerButtonText}>
//                     Request Download
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ) : (
//             <View style={styles.textContainer}>
//               <Text style={styles.bookText}>{selectedBook?.source}</Text>

//               {/* Info footer for text books */}
//               <View style={styles.textInfoFooter}>
//                 <Text style={styles.textInfoText}>
//                   This content is available for reading directly in the app.
//                 </Text>
//               </View>
//             </View>
//           )}

//           {loading && (
//             <View style={styles.loadingOverlay}>
//               <ActivityIndicator size="large" color="#007AFF" />
//               <Text style={styles.loadingText}>Loading...</Text>
//             </View>
//           )}
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   headerContainer: {
//     padding: 20,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e9ecef",
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 5,
//   },
//   subHeader: {
//     fontSize: 14,
//     color: "#7f8c8d",
//   },
//   list: {
//     padding: 15,
//     paddingTop: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 15,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   bookHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#2c3e50",
//     flex: 1,
//     marginRight: 10,
//   },
//   author: {
//     fontSize: 14,
//     color: "#3498db",
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 13,
//     color: "#7f8c8d",
//     lineHeight: 18,
//     marginBottom: 8,
//   },
//   pdfNote: {
//     fontSize: 12,
//     color: "#27ae60",
//     fontStyle: "italic",
//     marginTop: 5,
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   pdfBadge: {
//     backgroundColor: "#e8f4fd",
//   },
//   textBadge: {
//     backgroundColor: "#f0e6f6",
//   },
//   badgeText: {
//     fontSize: 10,
//     fontWeight: "bold",
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e9ecef",
//     backgroundColor: "#f8f9fa",
//   },
//   closeButton: {
//     padding: 5,
//   },
//   closeButtonText: {
//     fontWeight: "bold",
//     color: "#e74c3c",
//     fontSize: 16,
//   },
//   modalTitleContainer: {
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   modalTitle: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#2c3e50",
//   },
//   modalAuthor: {
//     fontSize: 13,
//     color: "#7f8c8d",
//     marginTop: 2,
//   },
//   downloadButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: "#3498db",
//     borderRadius: 6,
//   },
//   downloadButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 13,
//   },
//   pdfContainer: {
//     flex: 1,
//   },
//   webview: {
//     flex: 1,
//     width: Dimensions.get("window").width,
//   },
//   androidPdfContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   pdfMessageContainer: {
//     backgroundColor: "#fff",
//     padding: 25,
//     borderRadius: 12,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   pdfMessageTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 10,
//   },
//   pdfMessageText: {
//     fontSize: 14,
//     color: "#7f8c8d",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   downloadRequestButton: {
//     backgroundColor: "#27ae60",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   downloadRequestButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   textContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   bookText: {
//     fontSize: 16,
//     lineHeight: 26,
//     color: "#2c3e50",
//   },
//   textInfoFooter: {
//     marginTop: 30,
//     padding: 15,
//     backgroundColor: "#f8f9fa",
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: "#3498db",
//   },
//   textInfoText: {
//     fontSize: 14,
//     color: "#7f8c8d",
//     fontStyle: "italic",
//   },
//   requestBanner: {
//     padding: 15,
//     backgroundColor: "#fff8e1",
//     borderTopWidth: 1,
//     borderTopColor: "#ffecb3",
//     alignItems: "center",
//   },
//   requestBannerText: {
//     fontSize: 14,
//     color: "#ff8f00",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   requestBannerButton: {
//     backgroundColor: "#ff9800",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 6,
//   },
//   requestBannerButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholderText: {
//     marginTop: 10,
//     color: "#7f8c8d",
//     fontSize: 16,
//   },
//   loadingContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.9)",
//   },
//   loadingOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(255,255,255,0.9)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#7f8c8d",
//   },
// });
// // import { Asset } from "expo-asset";
// // import * as Sharing from "expo-sharing";
// // import React, { useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Alert,
// //   FlatList,
// //   Modal,
// //   Platform,
// //   SafeAreaView,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import { WebView } from "react-native-webview";

// // // Define the Book type
// // interface Book {
// //   id: string;
// //   title: string;
// //   author: string;
// //   source: any; // The result of require()
// //   type: "text" | "pdf";
// // }

// // const BOOKS: Book[] = [
// //   {
// //     id: "1",
// //     title: "The Great Gatsby",
// //     author: "F. Scott Fitzgerald",
// //     // source: require("../assets/books/gatsby.pdf"),
// //     source: require("../../assets/books/only_one_way.pdf"),
// //     type: "pdf",
// //   },
// //   {
// //     id: "2",
// //     title: "Short Story",
// //     author: "Unknown",
// //     source: "This is a sample text book content...",
// //     type: "text",
// //   },
// // ];

// // export default function Screen() {
// //   const [selectedBook, setSelectedBook] = useState<Book | null>(null);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const openBook = async (book: Book) => {
// //     if (book.type === "pdf") {
// //       // On Android + Expo Go, WebViews can't always render local PDFs.
// //       // We use Sharing as a reliable fallback.
// //       if (Platform.OS === "android") {
// //         const asset = Asset.fromModule(book.source);
// //         await asset.downloadAsync();
// //         if (await Sharing.isAvailableAsync()) {
// //           await Sharing.shareAsync(asset.localUri || asset.uri);
// //         } else {
// //           Alert.alert("Error", "Sharing is not available on this device");
// //         }
// //         return;
// //       }
// //     }

// //     // For iOS PDFs or all Text books, open the Modal
// //     setSelectedBook(book);
// //     setModalVisible(true);
// //   };

// //   const renderBookItem = ({ item }: { item: Book }) => (
// //     <TouchableOpacity style={styles.card} onPress={() => openBook(item)}>
// //       <Text style={styles.title}>{item.title}</Text>
// //       <Text style={styles.author}>{item.author}</Text>
// //       <View style={styles.badge}>
// //         <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Text style={styles.header}>Library</Text>

// //       <FlatList
// //         data={BOOKS}
// //         keyExtractor={(item) => item.id}
// //         renderItem={renderBookItem}
// //         contentContainerStyle={styles.list}
// //       />

// //       <Modal
// //         animationType="slide"
// //         transparent={false}
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <SafeAreaView style={styles.modalContainer}>
// //           <TouchableOpacity
// //             style={styles.closeButton}
// //             onPress={() => setModalVisible(false)}
// //           >
// //             <Text style={styles.closeButtonText}>✕ Close</Text>
// //           </TouchableOpacity>

// //           {selectedBook?.type === "pdf" ? (
// //             <View style={{ flex: 1 }}>
// //               {loading && (
// //                 <ActivityIndicator size="large" style={styles.loader} />
// //               )}
// //               <WebView
// //                 source={selectedBook.source}
// //                 originWhitelist={["*"]}
// //                 onLoadStart={() => setLoading(true)}
// //                 onLoadEnd={() => setLoading(false)}
// //                 style={{ flex: 1 }}
// //               />
// //             </View>
// //           ) : (
// //             <View style={styles.textContent}>
// //               <Text style={styles.bookText}>{selectedBook?.source}</Text>
// //             </View>
// //           )}
// //         </SafeAreaView>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#f5f5f5" },
// //   header: { fontSize: 28, fontWeight: "bold", margin: 20 },
// //   list: { padding: 10 },
// //   card: {
// //     backgroundColor: "#fff",
// //     padding: 20,
// //     borderRadius: 12,
// //     marginBottom: 15,
// //     elevation: 3,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   title: { fontSize: 18, fontWeight: "600" },
// //   author: { fontSize: 14, color: "#666", marginTop: 4 },
// //   badge: {
// //     alignSelf: "flex-start",
// //     backgroundColor: "#e0e0e0",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 4,
// //     marginTop: 10,
// //   },
// //   badgeText: { fontSize: 10, fontWeight: "bold", color: "#333" },
// //   modalContainer: { flex: 1, backgroundColor: "#fff" },
// //   closeButton: { padding: 15, backgroundColor: "#eee", alignItems: "center" },
// //   closeButtonText: { fontWeight: "bold", color: "red" },
// //   textContent: { padding: 20 },
// //   bookText: { fontSize: 16, lineHeight: 24 },
// //   loader: { position: "absolute", top: "50%", left: "50%", zIndex: 1 },
// // });
// // // import { IconSymbol } from "@/components/ui/icon-symbol";
// // // import { Colors, Fonts } from "@/constants/theme";
// // // import { useColorScheme } from "@/hooks/use-color-scheme";
// // // import React, { useState } from "react";
// // // import {
// // //   Alert,
// // //   Linking,
// // //   Modal,
// // //   ScrollView,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // // } from "react-native";
// // // import { SafeAreaView } from "react-native-safe-area-context";

// // // // Sample Book Data
// // // const BOOKS = [
// // //   {
// // //     id: "3",
// // //     type: "pdf",
// // //     title: "Only One Way!",
// // //     description: "Instruction on Vipasanna meditation.",
// // //     content: `./assets/books/only_one_way.pdf`,
// // //   },
// // //   // {
// // //   //   id: "1",
// // //   //   title: "The Noble Truths",
// // //   //   description: "A comprehensive guide to the Four Noble Truths.",
// // //   //   content: `
// // //   //     THE FOUR NOBLE TRUTHS
// // //   //     The Truth of Suffering (Dukkha)
// // //   //     ...
// // //   //     The Truth of the Cause of Suffering (Samudaya)
// // //   //     ...
// // //   //     The Truth of the End of Suffering (Nirodha)
// // //   //     ...
// // //   //     The Truth of the Path (Magga)
// // //   //     ...
// // //   //     (This is a placeholder for the book content. In a real app, this could be a PDF or longer text.)
// // //   //   `,
// // //   // },
// // //   // {
// // //   //   id: "2",
// // //   //   title: "Mindfulness of Breathing",
// // //   //   description: "Instructions on Anapanasati meditation.",
// // //   //   content: `
// // //   //     MINDFULNESS OF BREATHING
// // //   //     Breathing in long, he discerns, 'I am breathing in long'; or breathing out long, he discerns, 'I am breathing out long.'
// // //   //     ...
// // //   //   `,
// // //   // },
// // // ];

// // // export default function ExploreScreen() {
// // //   const colorScheme = useColorScheme();
// // //   const theme = Colors[colorScheme ?? "light"];
// // //   const [selectedBook, setSelectedBook] = useState<{
// // //     id: string;
// // //     title: string;
// // //     type: string;
// // //     content: string;
// // //   } | null>(null);

// // //   const handleRead = (book: (typeof BOOKS)[0]) => {
// // //     setSelectedBook(book);
// // //   };

// // //   const handleRequestDownload = () => {
// // //     Alert.alert(
// // //       "Request Download",
// // //       "Please email us to request a copy of this book.",
// // //       [
// // //         {
// // //           text: "Email Request",
// // //           onPress: () =>
// // //             Linking.openURL(
// // //               "mailto:htoomyatnyinyi@gmail.com?subject=Book Download Request",
// // //             ),
// // //         },
// // //         { text: "Cancel", style: "cancel" },
// // //       ],
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView
// // //       style={[styles.container, { backgroundColor: theme.background }]}
// // //     >
// // //       <View style={styles.header}>
// // //         <Text
// // //           style={[
// // //             styles.title,
// // //             { color: theme.primary, fontFamily: Fonts.rounded },
// // //           ]}
// // //         >
// // //           Dhamma Library
// // //         </Text>
// // //       </View>

// // //       <ScrollView contentContainerStyle={styles.listContent}>
// // //         {BOOKS.map((book) => (
// // //           <View
// // //             key={book.id}
// // //             style={[styles.bookCard, { backgroundColor: theme.surface }]}
// // //           >
// // //             <View style={styles.bookInfo}>
// // //               <IconSymbol name="book.fill" size={40} color={theme.secondary} />
// // //               <View style={styles.textContainer}>
// // //                 <Text style={[styles.bookTitle, { color: theme.text }]}>
// // //                   {book.title}
// // //                 </Text>
// // //                 <Text style={[styles.bookDesc, { color: theme.icon }]}>
// // //                   {book.description}
// // //                 </Text>
// // //               </View>
// // //             </View>

// // //             <View style={styles.actionRow}>
// // //               <TouchableOpacity
// // //                 style={[
// // //                   styles.readButton,
// // //                   { backgroundColor: theme.secondary },
// // //                 ]}
// // //                 onPress={() => handleRead(book)}
// // //               >
// // //                 <Text style={styles.buttonText}>Read Now</Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity
// // //                 style={[styles.requestButton, { borderColor: theme.icon }]}
// // //                 onPress={handleRequestDownload}
// // //               >
// // //                 <Text style={[styles.requestText, { color: theme.icon }]}>
// // //                   Request Download
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         ))}
// // //       </ScrollView>

// // //       {/* Reading Modal */}
// // //       <Modal
// // //         visible={!!selectedBook}
// // //         animationType="slide"
// // //         onRequestClose={() => setSelectedBook(null)}
// // //       >
// // //         <SafeAreaView
// // //           style={[styles.modalContainer, { backgroundColor: theme.background }]}
// // //         >
// // //           <View style={[styles.modalHeader, { borderBottomColor: theme.icon }]}>
// // //             <TouchableOpacity
// // //               onPress={() => setSelectedBook(null)}
// // //               style={styles.closeButton}
// // //             >
// // //               <Text
// // //                 style={{
// // //                   color: theme.secondary,
// // //                   fontSize: 18,
// // //                   fontWeight: "600",
// // //                 }}
// // //               >
// // //                 Done
// // //               </Text>
// // //             </TouchableOpacity>
// // //             <Text
// // //               style={[styles.modalTitle, { color: theme.text }]}
// // //               numberOfLines={1}
// // //             >
// // //               {selectedBook?.title}
// // //             </Text>
// // //             <View style={{ width: 40 }} />
// // //           </View>
// // //           <ScrollView style={styles.modalContent}>
// // //             <Text style={[styles.bookText, { color: theme.text }]}>
// // //               {selectedBook?.content}
// // //             </Text>
// // //             {/* // Inside your Modal's ScrollView or replacing it: */}
// // //             {/* {selectedBook?.type === "pdf" ? (
// // //               <Pdf
// // //                 source={selectedBook.content}
// // //                 style={{
// // //                   flex: 1,
// // //                   width: Dimensions.get("window").width,
// // //                   height: Dimensions.get("window").height,
// // //                 }}
// // //                 onError={(error) => {
// // //                   console.log(error);
// // //                 }}
// // //               />
// // //             ) : (
// // //               <Text style={[styles.bookText, { color: theme.text }]}>
// // //                 {selectedBook?.content}
// // //               </Text>
// // //             )} */}
// // //           </ScrollView>
// // //         </SafeAreaView>
// // //       </Modal>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   header: {
// // //     padding: 20,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: "rgba(0,0,0,0.05)",
// // //   },
// // //   title: {
// // //     fontSize: 28,
// // //     fontWeight: "bold",
// // //   },
// // //   listContent: {
// // //     padding: 20,
// // //     gap: 20,
// // //   },
// // //   bookCard: {
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   bookInfo: {
// // //     flexDirection: "row",
// // //     gap: 15,
// // //     marginBottom: 15,
// // //   },
// // //   textContainer: {
// // //     flex: 1,
// // //   },
// // //   bookTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "600",
// // //     marginBottom: 4,
// // //   },
// // //   bookDesc: {
// // //     fontSize: 14,
// // //   },
// // //   actionRow: {
// // //     flexDirection: "row",
// // //     gap: 10,
// // //     justifyContent: "flex-end",
// // //   },
// // //   readButton: {
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 20,
// // //   },
// // //   requestButton: {
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 20,
// // //     borderWidth: 1,
// // //   },
// // //   buttonText: {
// // //     color: "#fff",
// // //     fontWeight: "600",
// // //     fontSize: 14,
// // //   },
// // //   requestText: {
// // //     fontSize: 14,
// // //   },
// // //   modalContainer: {
// // //     flex: 1,
// // //     paddingTop: 20,
// // //   },
// // //   modalHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     padding: 20,
// // //     borderBottomWidth: 0.5,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 20,
// // //     fontWeight: "bold",
// // //   },
// // //   closeButton: {
// // //     padding: 5,
// // //   },
// // //   modalContent: {
// // //     flex: 1,
// // //     padding: 20,
// // //   },
// // //   bookText: {
// // //     fontSize: 16,
// // //     lineHeight: 24,
// // //     marginBottom: 50,
// // //   },
// // // });
