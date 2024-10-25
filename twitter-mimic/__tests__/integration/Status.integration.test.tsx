import { render, screen } from '@testing-library/react';
import TweetPage, { generateStaticParams } from '@/app/status/[Id]/page';
import '@testing-library/jest-dom';
import { firestore } from '../../firebase/admin';


jest.mock('../../firebase/client', () => ({
  fetchLatestTweets: jest.fn(() => Promise.resolve([
    { id: "tweet1" }, { id: "tweet2" }
  ]))
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: mockPush,
  })),
}));

jest.mock("../../hooks/useUser", () => ({
  __esModule: true,
  default: jest.fn( () => ({
    uid: "user123",
    displayName: "Test User",
    avatar: "avatar.png",
  })),
  USER_STATES: {
    NOT_LOGGED: null,
    NOT_KNOWN: undefined,
  },
}));

jest.mock('../../firebase/admin', () => ({
  firestore: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: jest.fn().mockReturnValue({
            id: "tweet1",
            content: "Este es un tweet de prueba",
            img: [],
            avatar: "avatar.png",
            userName: "Usuario Prueba",
            userId: "user123",
            likesCount: 10,
            sharedCount: 2,
            createdAt: {
              toDate: jest.fn(() => new Date("2024-10-24"))
            },
            sharedId: null,
            usersLiked: [],
            usersComments: []
          })
        })
      }))
    }))
  }
}));

describe('TweetPage', () => {
  it('should render the tweet correctly using the correct params', async () => {
    // const result = await firestore.collection("tweets").doc("tweet1").get();
    
    // console.log(result.data())

    // expect(result.exists).toBe(true);
    // expect(result.data()).toEqual({
    //   id: "tweet1",
    //   content: "Este es un tweet de prueba",
    //   img: [],
    //   avatar: "avatar.png",
    //   userName: "Usuario Prueba",
    //   userId: "user123",
    //   likesCount: 10,
    //   sharedCount: 2,
    //   createdAt: {
    //     toDate: expect.any(Function),
    //   },
    //   sharedId: null,
    //   usersLiked: [],
    //   usersComments: []
    // });


    render(await TweetPage({ params: { Id: 'tweet1' } }));

    expect(await screen.findByText("Este es un tweet de prueba")).toBeInTheDocument();
    expect(await screen.findByAltText("Usuario Prueba")).toBeInTheDocument();
  });

  it('should return the correct static params', async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([{ Id: "tweet1" }, { Id: "tweet2" }]);
  });

  it("should show a message when the tweet doesn't exist", async () => {
    (jest.mocked(firestore.collection) as jest.Mock).mockReturnValueOnce({
      doc: jest.fn().mockReturnValueOnce({
        get: jest.fn().mockResolvedValueOnce({
          exists: false,
        }),
      }),
    }) as jest.Mock;

    render(await TweetPage({ params: { Id: 'tweet1' } }));

    expect(await screen.findByText("Tweet no encontrado")).toBeInTheDocument();
  })
});