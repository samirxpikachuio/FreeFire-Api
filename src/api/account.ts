import { RELEASE_VERSION, DEBUG } from '../config/constant';
import { encodeProtobuf, decodeProtobuf } from '../utils/protobuf';

/**
 * Fetches a Garena access token using UID and password.
 * @param uid The Garena UID.
 * @param password The Garena password.
 * @returns A promise that resolves to the Garena authentication data.
 */
export async function getGarenaToken(uid: string, password: string) {
    const url = "https://ffmconnect.live.gop.garenanow.com/oauth/guest/token/grant";
    
    const payload = new URLSearchParams({
        uid,
        password,
        response_type: "token",
        client_type: "2",
        client_secret: "2ee44819e9b4598845141067b281621874d0d5d7af9d8f7e00c1e54715b7d1e3",
        client_id: "100067"
    });

    const headers = {
        'User-Agent': "GarenaMSDK/4.0.19P9(A063 ;Android 13;en;IN;)",
        'Connection': "Keep-Alive"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: payload,
            headers
        });

        if (!response.ok) {
            if (DEBUG) console.error(`[oauth/guest/token/grant] Error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        if (DEBUG) console.log("[oauth/guest/token/grant] Response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching Garena token:", error);
        return null;
    }
}

/**
 * Performs a major login to get a game session token.
 * @param logintoken The Garena access token.
 * @param openid The Garena open ID.
 * @returns A promise that resolves to the decoded session response.
 */
export async function getMajorLogin(logintoken: string, openid: string) { 
    const encryptedPayload = await encodeProtobuf({
        openid,
        logintoken,
        platform: "4"
    }, "request", "MajorLogin.proto");

    const url = "https://loginbp.ggpolarbear.com/MajorLogin";

    const headers = {
        'User-Agent': "Dalvik/2.1.0 (Linux; U; Android 13; A063 Build/TKQ1.221220.001)",
        'Connection': "Keep-Alive",
        'Content-Type': "application/x-www-form-urlencoded",
        'X-Unity-Version': "2018.4.11f1",
        'X-GA': "v1 1",
        'ReleaseVersion': RELEASE_VERSION,
        'Authorization': "Bearer"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: encryptedPayload,
            headers
        });

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (DEBUG) console.log("[MajorLogin] Response length:", buffer.length);

        const message = await decodeProtobuf(buffer, "response", "MajorLogin.proto");
        return message;
    } catch (error) {
        console.error("[MajorLogin] Error:", error);
        return null;
    }
}
