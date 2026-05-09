import { AuthService, PlayerService } from '../src/index';

async function main() {
    const uid = 13176741804; 
    const region = "BD";

    console.log(`📊 Fetching stats for UID ${uid} in ${region}...`);

    try {
        const session = await AuthService.loginForRegion(region);
        
   
        const brStats = await PlayerService.getPlayerStatistics(
            session.serverUrl, 
            session.token, 
            uid,
            'br',
            'CAREER'
        );

        console.log("✅ BR Career Stats:", JSON.stringify(brStats, null, 2));

       
        const csStats = await PlayerService.getPlayerStatistics(
            session.serverUrl, 
            session.token, 
            uid,
            'cs',
            'RANKED'
        );

        console.log("✅ CS Ranked Stats:", JSON.stringify(csStats, null, 2));
    } catch (error: any) {
        console.error("❌ Error:", error.message);
    }
}

main();
