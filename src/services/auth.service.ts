import { 
    RELEASE_VERSION, 
    DEBUG, 
    GARENA_AUTH_URL, 
    LOGIN_BP_URL, 
    GARENA_CLIENT_ID, 
    GARENA_CLIENT_SECRET,
    AUTH_USER_AGENT,
    GAME_USER_AGENT
} from '../config/constant';
import { encodeProtobuf, decodeProtobuf } from '../utils/protobuf';
import accounts from '../config/AccountConfiguration.json' with { type: "json" };

export class AuthService {
    static async authenticateGarena(uid: string, pass: string): Promise<{ accessToken: string; openId: string } | null> {
        const url = GARENA_AUTH_URL;
        
        const body = new URLSearchParams({
            uid,
            password: pass,
            response_type: "token",
            client_type: "2",
            client_secret: GARENA_CLIENT_SECRET,
            client_id: GARENA_CLIENT_ID
        });

        const headers = {
            'User-Agent': AUTH_USER_AGENT,
            'Connection': "Keep-Alive"
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                body,
                headers
            });

            if (!response.ok) {
                if (DEBUG) console.error(`[GarenaAuth] Failed with status: ${response.status}`);
                return null;
            }

            const data = await response.json() as { access_token: any; open_id: any };
            return {
                accessToken: data.access_token,
                openId: data.open_id
            };
        } catch (error) {
            console.error("[GarenaAuth] Exception:", error);
            return null;
        }
    }

    static async getSessionToken(accessToken: string, openId: string): Promise<{ token: string; serverUrl: string } | null> {
        const encryptedPayload = await encodeProtobuf({
            openid: openId,
            logintoken: accessToken,
            platform: "4"
        }, "MajorLogin.request", "MajorLogin.proto");

        const url = LOGIN_BP_URL;

        const headers = {
            'User-Agent': GAME_USER_AGENT,
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

            const buffer = Buffer.from(await response.arrayBuffer());
            const decoded = await decodeProtobuf(buffer, "MajorLogin.response", "MajorLogin.proto");
            
            return {
                token: decoded.token,
                serverUrl: decoded.serverUrl
            };
        } catch (error) {
            console.error("[SessionAuth] Exception:", error);
            return null;
        }
    }

    static async loginForRegion(region: string): Promise<{ token: string; serverUrl: string }> {
        const account = (accounts as any)[region.toUpperCase()];
        if (!account) throw new Error(`Unsupported region: ${region}`);

        const garenaAuth = await this.authenticateGarena(account.uid, account.password);
        if (!garenaAuth?.accessToken) throw new Error("Garena authentication failed");

        const session = await this.getSessionToken(garenaAuth.accessToken, garenaAuth.openId);
        if (!session?.token) throw new Error("Game session authentication failed");

        return session;
    }
}
