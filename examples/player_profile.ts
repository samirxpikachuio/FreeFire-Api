import { AuthService, PlayerService } from '../src/index';

async function main() {
    const uid = 13176741804; 
    const region = "BD";

    console.log(`👤 Fetching detailed profile for UID ${uid}...`);

    try {
        const session = await AuthService.loginForRegion(region);
        
        const profile = await PlayerService.getPlayerProfile(
            session.serverUrl,
            session.token,
            uid,
            {
                gallery: true,    
                sparkInfo: true   
            }
        );

        console.log("✅ Player Profile:", JSON.stringify(profile, null, 2));
    } catch (error: any) {
        console.error("❌ Error:", error.message);
    }
}

main();
