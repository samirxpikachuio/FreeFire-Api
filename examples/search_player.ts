import { AuthService, PlayerService } from '../src/index';

async function main() {
    const keyword = "✧ＦｉｌｔｈｙＸＸ彡";
    const region = "BD";

    console.log(`🔍 Searching for "${keyword}" in ${region} region...`);

    try {
        
        const session = await AuthService.loginForRegion(region);
        
      
        const searchResults = await PlayerService.searchPlayers(
            session.serverUrl, 
            session.token, 
            keyword
        );

        console.log("✅ Search Results:", JSON.stringify(searchResults, null, 2));
    } catch (error: any) {
        console.error("❌ Error:", error.message);
    }
}

main();
