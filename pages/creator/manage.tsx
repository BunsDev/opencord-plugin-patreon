import { isEmpty } from 'lodash';
import { useState } from 'react';

import { Box } from '@/components/core/Box';
import { Center, Column } from '@/components/core/Flex';
import { Image } from '@/components/core/Image';
import { TextInput } from '@/components/core/Input/TextInput';
import { Spinner } from '@/components/core/Spinner';
import { Text } from '@/components/core/Text';
import {
  EditLevelDialog,
  openEditLevelDialog,
} from '@/components/Dialogs/EditLevelDialog';
import { showToast } from '@/components/Dialogs/Toast';
import { MembershipLevelItemEditable } from '@/components/MembershipLevels/MembershipLevelItem';
import {
  MembershipLevelsHeaderEditable,
  MembershipLevelsOutdatedHeader,
} from '@/components/MembershipLevels/MembershipLevelsHeader';
import { SelectImage } from '@/components/select-image';
import { useEditCreatorInfo } from '@/hooks/useEditCreatorInfo';
import { usePatreonInfo } from '@/hooks/usePatreonInfo';
import { mockPatreonDataSets } from '@/net/http/mock';
import { Role } from '@/net/http/patreonComponents';
import { isNotEqual } from '@/utils/core/diff';
import { ImageType, uploadFiles } from '@/utils/files';

const CreatorManagerPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading } = usePatreonInfo();

  const {
    saveLevelInfo,
    linkRoles,
    deleteOutdatedLevel,
    refresh,
    refreshing,
    saving,
    saveCreatorInfo,
    dataSets: patreonInfo,
    avatar,
    setAvatar,
    name,
    setName,
    description,
    setDescription,
  } = useEditCreatorInfo(mockPatreonDataSets);

  const levels = patreonInfo?.levels ?? [];
  const levelsOutdated = patreonInfo?.outdatedLevels ?? [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadImageLoading, setUploadImageLoading] = useState(false);

  const _body = (
    <>
      <Column
        width="100%"
        maxWidth="840px"
        alignItems="start"
        padding="0 30px 30px 30px"
      >
        <Text
          fontSize={'24px'}
          lineHeight="30px"
          fontWeight={'700'}
          textAlign="center"
          marginBottom="30px"
        >
          Patreon Membership NFT Pass
        </Text>
        <Text
          fontSize={'16px'}
          lineHeight="20px"
          fontWeight={'700'}
          textAlign="center"
          marginBottom="10px"
        >
          Profile
        </Text>
        <Column
          alignItems="start"
          width="100%"
          padding="20px"
          borderRadius="4px"
          border="1px solid #373737"
        >
          <Text
            color="rgba(255, 255, 255,1)"
            fontSize={'14px'}
            lineHeight="18px"
            fontWeight={'400'}
            marginBottom="10px"
          >
            Avatar
          </Text>
          <SelectImage
            selectChange={async (files) => {
              if (files === null || files === undefined) {
                return;
              }
              if (loading) {
                return;
              }
              try {
                setUploadImageLoading(true);
                const result = await uploadFiles(files, {
                  type: ImageType.AVATAR,
                });

                if (!isEmpty(result)) {
                  const imageInfo = result?.[0];
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { localPath = '', uploadedUrl = '' } = imageInfo ?? {};
                  setAvatar(uploadedUrl);

                  const updateUserResult: {
                    code: number;
                    message: string;
                  } = (await saveCreatorInfo()) as any;
                  if (updateUserResult.code) {
                    if (updateUserResult.code === 2000) {
                      showToast(updateUserResult.message);
                    }

                    return;
                  }
                }
              } finally {
                setUploadImageLoading(false);
              }
            }}
          >
            <Image
              src={avatar}
              size="64px"
              borderRadius={'50%'}
              marginBottom="10px"
            />
          </SelectImage>
          <Text
            color="rgba(255, 255, 255,1)"
            fontSize={'14px'}
            lineHeight="18px"
            fontWeight={'400'}
            marginBottom="10px"
          >
            Name
          </Text>
          <TextInput
            value={name}
            onChange={(s) => {
              setName(s);
            }}
            marginBottom="10px"
          />
          <Text
            color="rgba(255, 255, 255,1)"
            fontSize={'14px'}
            lineHeight="18px"
            fontWeight={'400'}
            marginBottom="10px"
          >
            Introduction
          </Text>
          <TextInput
            value={description}
            onChange={(s) => {
              setDescription(s);
            }}
            marginBottom="20px"
          />
          <Center
            color="#000"
            width="100px"
            height="30px"
            borderRadius="4px"
            background="#fff"
            fontWeight={600}
            cursor={'pointer'}
            userSelect="none"
            onClick={saveCreatorInfo}
          >
            {saving ? (
              <Spinner size="16px" thickness="2px" theme="light" />
            ) : (
              'Save'
            )}
          </Center>
        </Column>
      </Column>
    </>
  );

  const _membershipLevels = (
    <Column
      width="100%"
      maxWidth="840px"
      alignItems="start"
      marginBottom="30px"
    >
      <MembershipLevelsHeaderEditable
        refresh={refresh}
        refreshing={refreshing}
      />
      {levels.length < 1 ? (
        <Center
          width="100%"
          color="rgba(255, 255, 255, 0.6)"
          fontSize={'12px'}
          lineHeight="15px"
          fontWeight={'500'}
          textAlign="center"
          padding={'20px 30px'}
        >
          <Text>There are no membership levels assigned to roles.</Text>
        </Center>
      ) : (
        levels.map((level) => {
          return (
            <MembershipLevelItemEditable
              key={level.id}
              level={level}
              onEditLevel={() => {
                openEditLevelDialog({
                  level: level,
                  onSave: async (newLevel) => {
                    if (isNotEqual(level, newLevel)) {
                      return await saveLevelInfo(newLevel);
                    }
                    return true;
                  },
                });
              }}
              onLinkRole={() => {
                // todo link role select menu
                const linkedRoles: Role[] = [];
                linkRoles(level, linkedRoles);
              }}
            />
          );
        })
      )}
    </Column>
  );

  const _membershipLevelsOutdated =
    levelsOutdated.length < 1 ? (
      <Box />
    ) : (
      <Column
        width="100%"
        maxWidth="840px"
        alignItems="start"
        marginBottom="30px"
      >
        <MembershipLevelsOutdatedHeader />
        {levelsOutdated.map((level) => {
          return (
            <MembershipLevelItemEditable
              isDelete
              key={level.id}
              level={level}
              onDeleteLevel={() => {
                deleteOutdatedLevel(level);
              }}
            />
          );
        })}
      </Column>
    );

  return loading ? (
    <Center width="100%" height="100vh">
      <Spinner theme="dark" />
    </Center>
  ) : (
    <Column width="100%" padding="30px">
      <EditLevelDialog />
      {_body}
      {_membershipLevels}
      {_membershipLevelsOutdated}
    </Column>
  );
};

export default CreatorManagerPage;