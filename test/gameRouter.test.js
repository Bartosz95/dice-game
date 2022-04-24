import gameRouter from '../routers/gameRouter';

describe('gameRouter', () => {
    test('check if router contain all endpoints', () => {
        
        const expectedRouterEndpoints = [
            { method: 'get', path: '/' },
            { method: 'get', path: '/user/:userID/game' },
            { method: 'get', path: '/user/:userID/game/:gameID' },
            { method: 'post', path: '/user/:userID/game' },
            { method: 'post', path: '/user/:userID/game/:gameID' },
            { method: 'delete', path: '/user/:userID/game' },
            { method: 'delete', path: '/user/:userID/game/:gameID' }
        ]
        
        const routerEndpoints = gameRouter.stack.map(Layer => { 
            const methods = Object.keys(Layer.route.methods)
            return { 
                method: methods.length === 1 ? methods[0] : methods,
                path: Layer.route.path.toString()
            }
        })
        expect(routerEndpoints).toEqual(expectedRouterEndpoints)
    })
})