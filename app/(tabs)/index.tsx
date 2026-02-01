import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import AudioController from "@/components/AudioController";
import MeditationTimer from "@/components/MeditationTimer";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setVolume, toggleDhammaAudio } from "@/store/audioSlice";
import { RootState } from "@/store/store";
import { setIntervalTime } from "@/store/timerSlice";
import Slider from "@react-native-community/slider";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { enableDhammaAudio, volume } = useSelector(
    (state: RootState) => state.audio,
  );
  const { interval, isRunning } = useSelector(
    (state: RootState) => state.timer,
  );

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // console.log("volume", volume);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <AudioController />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.primary }]}>
            Noble Truth
          </Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>
            Find your inner peace
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <MeditationTimer />
        </View>

        <View
          style={[styles.settingsContainer, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Settings
          </Text>

          {/* Interval Setting */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Bell Interval
            </Text>
            <View style={styles.intervalToggle}>
              <Text
                style={[
                  styles.intervalOption,
                  interval === 30 && {
                    color: theme.secondary,
                    fontWeight: "bold",
                  },
                ]}
                onPress={() => !isRunning && dispatch(setIntervalTime(30))}
              >
                30m
              </Text>
              <Text style={{ color: theme.icon }}> | </Text>
              <Text
                style={[
                  styles.intervalOption,
                  interval === 60 && {
                    color: theme.secondary,
                    fontWeight: "bold",
                  },
                ]}
                onPress={() => !isRunning && dispatch(setIntervalTime(60))}
              >
                1h
              </Text>
            </View>
          </View>

          {/* Dhamma Audio Setting */}
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Dhamma Audio
              </Text>
              <Text style={[styles.settingDescription, { color: theme.icon }]}>
                အာနာပါနသမထပိုင်း လမ်းညွန် အသံဖိုင်
              </Text>
            </View>

            <Switch
              value={enableDhammaAudio}
              onValueChange={() => dispatch(toggleDhammaAudio())}
              trackColor={{ false: theme.icon, true: theme.secondary }}
              thumbColor={"#078fffff"}
            />
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text>Volume: {Math.round(volume * 100)}%</Text>

            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              step={0.01} // This controls the granularity
              value={volume}
              onValueChange={(value) => dispatch(setVolume(value))}
              minimumTrackTintColor="#1EB1FC"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1EB1FC"
            />
          </View>
        </View>
        {/* <View>
          <TouchableOpacity
            onPressIn={() =>
              dispatch(setVolume(parseFloat((volume + 0.1).toFixed(1))))
            }
          >
            <View>
              <Text>{volume}</Text>
              <Text>+</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={() =>
              dispatch(setVolume(parseFloat((volume - 0.1).toFixed(1))))
            }
          >
            <View>
              <Text>{volume}</Text>
              <Text>-</Text>
            </View>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    minHeight: "100%",
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: "italic",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  settingsContainer: {
    padding: 20,
    borderRadius: 16,
    gap: 20,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
  },
  intervalToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  intervalOption: {
    fontSize: 16,
    padding: 5,
  },
});
