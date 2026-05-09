import { Elysia, t } from 'elysia';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';
import { DEFAULT_REGION } from '../config/constant';

export const playerRoutes = new Elysia({ prefix: '/player' })
    .get('/search', async ({ query, set }) => {
        const { server = DEFAULT_REGION, keyword } = query;
        
        try {
            const session = await AuthService.loginForRegion(server);
            return await PlayerService.searchPlayers(session.serverUrl, session.token, keyword);
        } catch (error: any) {
            set.status = error.message.includes('region') ? 400 : 500;
            return { success: false, error: error.message };
        }
    }, {
        query: t.Object({
            server: t.Optional(t.String()),
            keyword: t.String({ minLength: 3 })
        })
    })

    .get('/stats', async ({ query, set }) => {
        const { server = 'BD', uid, mode = 'br', matchType = 'CAREER' } = query;
        const uidNum = parseInt(uid);

        if (isNaN(uidNum)) {
            set.status = 400;
            return { success: false, error: "Invalid UID format" };
        }

        try {
            const session = await AuthService.loginForRegion(server);
            const stats = await PlayerService.getPlayerStatistics(
                session.serverUrl, 
                session.token, 
                uidNum, 
                mode as 'br' | 'cs', 
                matchType as 'CAREER' | 'NORMAL' | 'RANKED'
            );
            
            return {
                success: true,
                data: stats,
                metadata: { server, uid: uidNum, mode, matchType }
            };
        } catch (error: any) {
            set.status = 500;
            return { success: false, error: error.message };
        }
    }, {
        query: t.Object({
            server: t.Optional(t.String()),
            uid: t.String(),
            mode: t.Optional(t.Union([t.Literal('br'), t.Literal('cs')])),
            matchType: t.Optional(t.Union([t.Literal('CAREER'), t.Literal('NORMAL'), t.Literal('RANKED')]))
        })
    })

    .get('/profile', async ({ query, set }) => {
        const { 
            server = 'BD', 
            uid, 
            gallery = 'false', 
            blacklist = 'false', 
            spark = 'false', 
            callSignSrc = '7' 
        } = query;

        const uidNum = parseInt(uid);
        if (isNaN(uidNum)) {
            set.status = 400;
            return { success: false, error: "Invalid UID" };
        }

        try {
            const session = await AuthService.loginForRegion(server);
            const profile = await PlayerService.getPlayerProfile(
                session.serverUrl,
                session.token,
                uidNum,
                {
                    gallery: gallery === 'true',
                    blacklist: blacklist === 'true',
                    sparkInfo: spark === 'true',
                    callSignSrc: parseInt(callSignSrc)
                }
            );

            return profile;
        } catch (error: any) {
            set.status = 500;
            return { success: false, error: error.message };
        }
    }, {
        query: t.Object({
            server: t.Optional(t.String()),
            uid: t.String(),
            gallery: t.Optional(t.String()),
            blacklist: t.Optional(t.String()),
            spark: t.Optional(t.String()),
            callSignSrc: t.Optional(t.String())
        })
    });
