import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Register fonts if needed, using standard fonts for now
Font.register({
    family: "Helvetica",
    fonts: [
        { src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf" }, // Standard font fallback
    ],
})

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 30,
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#1E293B",
    },
    subtitle: {
        fontSize: 12,
        color: "#64748B",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    dayHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 10,
        color: "#2563EB",
    },
    activity: {
        marginBottom: 10,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: "#E2E8F0",
    },
    timeSlot: {
        fontSize: 10,
        color: "#64748B",
        marginBottom: 2,
    },
    activityName: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
    },
    description: {
        fontSize: 10,
        color: "#334155",
        marginBottom: 2,
    },
    cost: {
        fontSize: 10,
        color: "#10B981",
    },
    summary: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#F8FAFC",
        borderRadius: 4,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    summaryText: {
        fontSize: 12,
        marginBottom: 2,
    },
})

interface ItineraryData {
    overview: {
        destination: string
        duration: string
        totalEstimatedCost: string
    }
    days: {
        day: number
        activities: {
            timeSlot: string
            name: string
            description: string
            cost: string
            whyRecommended: string
        }[]
        transportation: string
        dailyCost: string
    }[]
    summary: {
        totalEstimatedCost: string
        totalActivities: number
        keyHighlights: string[]
    }
}

export function PdfDocument({ data }: { data: ItineraryData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{data.overview.destination}</Text>
                    <Text style={styles.subtitle}>
                        {data.overview.duration} • {data.overview.totalEstimatedCost}
                    </Text>
                </View>

                {data.days.map((day) => (
                    <View key={day.day}>
                        <Text style={styles.dayHeader}>
                            Day {day.day} - {day.dailyCost}
                        </Text>
                        {day.activities.map((activity, index) => (
                            <View key={index} style={styles.activity}>
                                <Text style={styles.timeSlot}>{activity.timeSlot}</Text>
                                <Text style={styles.activityName}>{activity.name}</Text>
                                <Text style={styles.description}>{activity.description}</Text>
                                <Text style={styles.cost}>Cost: {activity.cost}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Trip Summary</Text>
                    <Text style={styles.summaryText}>
                        Total Estimated Cost: {data.summary.totalEstimatedCost}
                    </Text>
                    <Text style={styles.summaryText}>
                        Total Activities: {data.summary.totalActivities}
                    </Text>
                    <Text style={styles.summaryText}>
                        Highlights: {data.summary.keyHighlights.join(", ")}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
