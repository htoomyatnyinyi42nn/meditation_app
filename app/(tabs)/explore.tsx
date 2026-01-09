import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Sample Book Data
const BOOKS = [
  {
    id: "1",
    title: "The Handbook",
    description: "A comprehensive guide.",
    file: require("@/assets/books/handbook.pdf"),
  },
  {
    id: "2",
    title: "Only One Way",
    description: "A path to enlightenment.",
    file: require("@/assets/books/only_one_way.pdf"),
  },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [selectedBook, setSelectedBook] = useState<{
    id: string;
    title: string;
    file: any;
  } | null>(null);
  const [loadingAndroid, setLoadingAndroid] = useState(false);

  const handleRead = async (book: (typeof BOOKS)[0]) => {
    if (Platform.OS === "android") {
      // Android: Open in System Viewer to handle large files and avoid crashes
      setLoadingAndroid(true);
      try {
        const asset = Asset.fromModule(book.file);
        await asset.downloadAsync();
        const contentUri = await FileSystem.getContentUriAsync(
          asset.localUri || asset.uri
        );
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        });
      } catch (e) {
        console.log("Error opening PDF on Android:", e);
        Alert.alert("Error", "Could not open the book.");
      } finally {
        setLoadingAndroid(false);
      }
    } else {
      // iOS: Use In-App WebView (Supports PDF natively and efficiently)
      setSelectedBook(book);
    }
  };

  const handleRequestDownload = (title: string) => {
    Alert.alert(
      "Request Download",
      `Please email us to request a copy of "${title}".`,
      [
        {
          text: "Email Request",
          onPress: () =>
            Linking.openURL(
              `mailto:htoomyatnyinyi@gmail.com?subject=Book Download Request: ${title}`
            ),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: theme.primary, fontFamily: Fonts.rounded },
          ]}
        >
          Dhamma Library
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {BOOKS.map((book) => (
          <View
            key={book.id}
            style={[styles.bookCard, { backgroundColor: theme.surface }]}
          >
            <View style={styles.bookInfo}>
              <IconSymbol name="book.fill" size={40} color={theme.secondary} />
              <View style={styles.textContainer}>
                <Text style={[styles.bookTitle, { color: theme.text }]}>
                  {book.title}
                </Text>
                <Text style={[styles.bookDesc, { color: theme.icon }]}>
                  {book.description}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.readButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={() => handleRead(book)}
                disabled={loadingAndroid}
              >
                {loadingAndroid ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Read Now</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.requestButton, { borderColor: theme.icon }]}
                onPress={() => handleRequestDownload(book.title)}
              >
                <Text style={[styles.requestText, { color: theme.icon }]}>
                  Request PDF
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Reading Modal (iOS only) */}
      <Modal
        visible={!!selectedBook}
        animationType="slide"
        onRequestClose={() => setSelectedBook(null)}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View style={[styles.modalHeader, { borderBottomColor: theme.icon }]}>
            <TouchableOpacity
              onPress={() => setSelectedBook(null)}
              style={styles.closeButton}
            >
              <Text
                style={{
                  color: theme.secondary,
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
            <Text
              style={[styles.modalTitle, { color: theme.text }]}
              numberOfLines={1}
            >
              {selectedBook?.title}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.modalContent}>
            {selectedBook && (
              <WebView
                style={{ flex: 1 }}
                source={selectedBook.file}
                originWhitelist={["*"]}
                scalesPageToFit={true}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  bookCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookInfo: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  bookDesc: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  readButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  requestButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  requestText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 0.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  bookText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 50,
  },
});
