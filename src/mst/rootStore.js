import { types } from 'mobx-state-tree';

const { model, string, optional } = types;

export const rootStore = model({
  gamePosition: optional(string, ''),
}).actions((self) => ({
  setGamePosition(fenString) {
    self.gamePosition = fenString;
  },
}));
