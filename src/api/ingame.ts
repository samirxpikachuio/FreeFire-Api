import { RELEASE_VERSION, DEBUG } from '../config/constant';
import { encodeProtobuf, decodeProtobuf } from '../utils/protobuf';

export async function searchAccountByKeyword(serverUrl: string, authToken: string, keyword: string) {
    const endpoint = `${serverUrl}/FuzzySearchAccountByName`;
    
    try {
        const encryptedPayload = await encodeProtobuf({
            keyword: String(keyword)
        }, "request", "SearchAccountByName.proto");

        const headers = {
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13; A063 Build/TKQ1.221220.001)",
            "Connection": "Keep-Alive",
            "Authorization": `Bearer ${authToken}`,
            "X-Unity-Version": "2018.4.11f1",
            "X-GA": "v1 1",
            "ReleaseVersion": RELEASE_VERSION,
            "Content-Type": "application/x-www-form-urlencoded",
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            body: encryptedPayload,
            headers,
            signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (!buffer.length) {
            throw new Error("Empty response received from server.");
        }

        const decoded = await decodeProtobuf(buffer, "response", "SearchAccountByName.proto");
        return decoded;
    } catch (error) {
        if (DEBUG) console.error("searchAccountByKeyword error:", error);
        throw error;
    }
}

export async function getPlayerPersonalShow(
    serverUrl: string, 
    authorization: string, 
    accountId: number, 
    needGalleryInfo: boolean = false, 
    callSignSrc: number = 7, 
    needBlacklist: boolean = false, 
    needSparkInfo: boolean = false
) {
    const url = `${serverUrl}/GetPlayerPersonalShow`;

    const encryptedPayload = await encodeProtobuf({
        accountId,
        callSignSrc,
        needGalleryInfo,
        needBlacklist,
        needSparkInfo,
    }, "request", "PlayerPersonalShow.proto");

    const headers = {
        "User-Agent": "UnityPlayer/2022.3.47f1 (UnityWebRequest/1.0, libcurl/8.5.0-DEV)",
        "Accept": "*/*",
        "Authorization": `Bearer ${authorization}`,
        "X-GA": "v1 1",
        "ReleaseVersion": RELEASE_VERSION,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Unity-Version": "2022.3.47f1"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: encryptedPayload,
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const message = await decodeProtobuf(buffer, "response", "PlayerPersonalShow.proto");
        return message;
    } catch (error) {
        if (DEBUG) console.error("getPlayerPersonalShow error:", error);
        return null;
    }
}

export async function getPlayerStats(
    authorization: string, 
    serverUrl: string, 
    mode: string, 
    uid: string | number, 
    matchType: string = "CAREER"
) {
    const uidNum = Number(uid);
    if (isNaN(uidNum)) throw new Error(`Invalid UID: ${uid}`);

    const modeLower = mode.toLowerCase();
    if (modeLower !== "br" && modeLower !== "cs") throw new Error("Invalid mode. Must be 'br' or 'cs'");

    const matchTypeUpper = matchType.toUpperCase();
    
    let url: string;
    let protoFile: string;
    let typeMapping: Record<string, number>;

    if (modeLower === "br") {
        url = `${serverUrl}/GetPlayerStats`;
        protoFile = "PlayerStats.proto";
        typeMapping = { "CAREER": 0, "NORMAL": 1, "RANKED": 2 };
    } else {
        url = `${serverUrl}/GetPlayerTCStats`;
        protoFile = "PlayerCSStats.proto";
        typeMapping = { "CAREER": 0, "NORMAL": 1, "RANKED": 6 };
    }

    const matchMode = typeMapping[matchTypeUpper];
    if (matchMode === undefined) throw new Error("Invalid match type. Must be 'CAREER', 'NORMAL', or 'RANKED'");

    const payloadData: any = { accountid: uidNum, matchmode: matchMode };
    if (modeLower === "cs") {
        payloadData.gamemode = 15; // CS mode
    }

    const encryptedPayload = await encodeProtobuf(payloadData, "request", protoFile);

    const headers = {
        'User-Agent': "Dalvik/2.1.0 (Linux; U; Android 13; A063 Build/TKQ1.221220.001)",
        'Connection': "Keep-Alive",
        'Authorization': `Bearer ${authorization}`,
        'X-Unity-Version': "2018.4.11f1",
        'X-GA': "v1 1",
        'ReleaseVersion': RELEASE_VERSION,
        'Content-Type': "application/x-www-form-urlencoded"
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: encryptedPayload,
            headers,
            signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (!buffer.length) throw new Error("Empty response from server");

        const message = await decodeProtobuf(buffer, "response", protoFile);
        return message;
    } catch (error) {
        if (DEBUG) console.error("getPlayerStats error:", error);
        throw error;
    }
}
