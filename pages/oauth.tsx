import { NextPage } from 'next';

import { Center, Column } from '@/components/Flex';
import { Image } from '@/components/Image';
import { Text } from '@/components/Text';
import { icons, images } from '@/utils/assets';

const OAuthPage: NextPage = () => {
  return (
    <Center
      width="100%"
      height="100vh"
      transform="rotate(180deg)"
      backgroundRepeat="no-repeat"
      backgroundImage={`url("${images('bg-logo.svg')}")`}
      backgroundPosition="100% 100%"
      backgroundSize="625px 528px"
    >
      <Center
        width="100%"
        height="100vh"
        transform="rotate(180deg)"
        backgroundRepeat="no-repeat"
        backgroundImage={`url("${images('bg-logo.svg')}")`}
        backgroundPosition="100% 100%"
        backgroundSize="625px 528px"
      >
        <Column
          width="551px"
          height="272px"
          borderRadius="12px"
          background="#333333"
          boxShadow="0px 0px 8px rgba(0, 0, 0, 0.15)"
          paddingTop="60px"
        >
          <Image src={icons('ok.svg')} size="72px" />
          <Text
            color="#fff"
            fontSize={'32px'}
            lineHeight="40px"
            fontWeight={'700'}
            margin={'10px'}
          >
            Connected
          </Text>
          <Text
            fontSize={'16px'}
            lineHeight="20px"
            fontWeight={'400'}
            color={'rgba(255, 255, 255, 0.6)'}
          >
            You can now close this window and return to Opencord to continue.
          </Text>
        </Column>
      </Center>
    </Center>
  );
};

export default OAuthPage;