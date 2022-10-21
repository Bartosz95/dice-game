import { configActions } from './config-slice';


export const initConfig = () => {
  return async (dispatch) => {
    try {
        const data = await fetch('/config.json', {
          headers: {
            'Content-Type': 'application/json',
          }})
          const config = await data.json()
          dispatch(
            configActions.init({
                DICE_GAME_API: config.DICE_GAME_API
            })
          );
        } catch (err) {
            dispatch(
                configActions.init({
                    DICE_GAME_API: ''
                })
              );
        }
  };
};
