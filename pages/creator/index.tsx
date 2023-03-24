import { NextPage } from 'next';

// import { StateType } from '@/constants/store';
import { useAsync } from '@/hooks/core/useAsync';

// import { useStore } from '@/utils/store/useStore';
import CreatorManagerPage from './manage';
import CreatorNotConnectPage from './not-connect';

const useCreatorPage = () => {
  // const [beenSet] = useStore(StateType.BEEN_SET);

  // page info
  const {
    loading,
    data: _userInfo,
    run: fetchUserInfo,
  } = useAsync<{
    roles: { name: string; color: string }[];
    nft: { image: string };
  }>(
    async () => {
      // todo fetch user's current NFT and roles
      return undefined;
    },
    { immediately: false },
  );

  return {
    beenSet: true,
    fetchUserInfo,
    userInfo: {
      link: 'https://patreon.com',
      nft: {
        image:
          'https://c10.patreonusercontent.com/4/patreon-media/p/reward/5971375/e896ec5e508746e4962cbc4afbed93f8/eyJ3Ijo0MDB9/1.png?token-time=2145916800&token-hash=3jWLUC5cNN1a8TuUSlKSGdZGzLAAE6fUCnwfKOBM2vk%3D',
      },
      roles: [
        {
          name: 'adminwedewdededededewd',
          color: '#ff0000',
        },
        {
          name: 'cordewddededewdewwedewdewdewdewdewdewdewdewe',
          color: '#0000ff',
        },
      ],
    },
    loading,
  };
};

const CreatorPage: NextPage = () => {
  const { beenSet } = useCreatorPage();

  if (beenSet === undefined) {
    return <div>do not login in, not available</div>;
  }
  return beenSet ? <CreatorManagerPage /> : <CreatorNotConnectPage />;
};

export default CreatorPage;