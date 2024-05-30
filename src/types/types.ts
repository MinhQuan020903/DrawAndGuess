export interface SessionComponentProps {
  session: any;
}

export interface Player {
  id: any;
  currentTurn: true;
  nextTurn: false;
  points: number;
  Detail: {
    username: string;
    avatar: string;
  };
}
