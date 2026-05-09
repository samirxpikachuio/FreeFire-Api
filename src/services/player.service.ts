import { RELEASE_VERSION, DEBUG, GAME_USER_AGENT, UNITY_USER_AGENT } from '../config/constant';
import { encodeProtobuf, decodeProtobuf } from '../utils/protobuf';

/**
 * Service for retrieving player-related data from the game servers.
 */
export class PlayerService {
    private static COMMON_HEADERS = {
        "User-Agent": GAME_USER_AGENT,
        "Connection": "Keep-Alive",
        "X-Unity-Version": "2018.4.11f1",
        "X-GA": "v1 1",
        "ReleaseVersion": RELEASE_VERSION,
        "Content-Type": "application/x-www-form-urlencoded",
    };

    /**
     * Searches for players by their in-game name.
     * @param serverUrl The game server URL.
     * @param token The session token.
     * @param keyword The name or keyword to search for.
     * @returns A promise that resolves to the search results.
     */
    static async searchPlayers(serverUrl: string, token: string, keyword: string): Promise<any> {
        const endpoint = `${serverUrl}/FuzzySearchAccountByName`;
        
        try {
            const payload = await encodeProtobuf({
                keyword: String(keyword)
            }, "SearchAccountByName.request", "SearchAccountByName.proto");

            const response = await fetch(endpoint, {
                method: 'POST',
                body: payload,
                headers: {
                    ...this.COMMON_HEADERS,
                    "Authorization": `Bearer ${token}`,
                },
                signal: AbortSignal.timeout(15000)
            });

            if (!response.ok) throw new Error(`Search failed: ${response.status}`);

            const buffer = Buffer.from(await response.arrayBuffer());
            return await decodeProtobuf(buffer, "SearchAccountByName.response", "SearchAccountByName.proto", false);
        } catch (error) {
            if (DEBUG) console.error("[PlayerService.searchPlayers] Error:", error);
            throw error;
        }
    }

    /**
     * Retrieves the profile information for a specific player.
     * @param serverUrl The game server URL.
     * @param token The session token.
     * @param uid The player's unique ID.
     * @param options Additional options for the profile request.
     * @returns A promise that resolves to the player's profile data.
     */
    static async getPlayerProfile(
        serverUrl: string, 
        token: string, 
        uid: number, 
        options: {
            /** Whether to include gallery information. */
            gallery?: boolean;
            /** Whether to include blacklist information. */
            blacklist?: boolean;
            /** Whether to include spark information. */
            sparkInfo?: boolean;
            /** The call sign source. */
            callSignSrc?: number;
        } = {}
    ): Promise<any> {
        const url = `${serverUrl}/GetPlayerPersonalShow`;

        try {
            const payload = await encodeProtobuf({
                accountId: uid,
                callSignSrc: options.callSignSrc ?? 7,
                needGalleryInfo: options.gallery ?? false,
                needBlacklist: options.blacklist ?? false,
                needSparkInfo: options.sparkInfo ?? false,
            }, "PlayerPersonalShow.request", "PlayerPersonalShow.proto");

            const response = await fetch(url, {
                method: 'POST',
                body: payload,
                headers: {
                    ...this.COMMON_HEADERS,
                    "User-Agent": UNITY_USER_AGENT,
                    "X-Unity-Version": "2022.3.47f1",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error(`Profile fetch failed: ${response.status}`);

            const buffer = Buffer.from(await response.arrayBuffer());
            if (process.env.DEBUG_BYTES) {
                console.log("[DEBUG] Response Bytes (Hex):", buffer.subarray(0, 64).toString('hex'));
                console.log("[DEBUG] Response Length:", buffer.length);
            }
            return await decodeProtobuf(buffer, "PlayerPersonalShow.response", "PlayerPersonalShow.proto", false);
        } catch (error) {
            if (DEBUG) console.error("[PlayerService.getPlayerProfile] Error:", error);
            throw error;
        }
    }

    /**
     * Retrieves game statistics for a specific player.
     * @param serverUrl The game server URL.
     * @param token The session token.
     * @param uid The player's unique ID.
     * @param mode The game mode ('br' for Battle Royale, 'cs' for Clash Squad).
     * @param matchType The type of match ('CAREER', 'NORMAL', 'RANKED').
     * @returns A promise that resolves to the player's statistics.
     */
    static async getPlayerStatistics(
        serverUrl: string,
        token: string, 
        uid: number,
        mode: 'br' | 'cs' = 'br', 
        matchType: 'CAREER' | 'NORMAL' | 'RANKED' = 'CAREER'
    ): Promise<any> {
        let url: string;
        let protoFile: string;
        let typeValue: number = 0;

        if (mode === "br") {
            url = `${serverUrl}/GetPlayerStats`;
            protoFile = "PlayerStats.proto";
            const mapping: Record<string, number> = { "CAREER": 0, "NORMAL": 1, "RANKED": 2 };
            typeValue = mapping[matchType] ?? 0;
        } else {
            url = `${serverUrl}/GetPlayerTCStats`;
            protoFile = "PlayerCSStats.proto";
            const mapping: Record<string, number> = { "CAREER": 0, "NORMAL": 1, "RANKED": 6 };
            typeValue = mapping[matchType] ?? 0;
        }

        const payloadData: any = { accountid: uid, matchmode: typeValue };
        if (mode === "cs") payloadData.gamemode = 15;

        try {
            const payload = await encodeProtobuf(payloadData, `${protoFile.split('.')[0]}.request`, protoFile);

            const response = await fetch(url, {
                method: 'POST',
                body: payload,
                headers: {
                    ...this.COMMON_HEADERS,
                    "Authorization": `Bearer ${token}`,
                },
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) throw new Error(`Stats fetch failed: ${response.status}`);

            const buffer = Buffer.from(await response.arrayBuffer());
            return await decodeProtobuf(buffer, `${protoFile.split('.')[0]}.response`, protoFile, false);
        } catch (error) {
            if (DEBUG) console.error("[PlayerService.getPlayerStatistics] Error:", error);
            throw error;
        }
    }
}
