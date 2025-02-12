import { ViewIcon } from "@chakra-ui/icons";
import './VodCard.css';
import {
  Box,
  Divider,
  Flex,
  Image,
  Link,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { VodModel } from "../../model/VodModel";
import SocialLinks from "../socialLinks/SocialLinks";
import axios from "axios";
import { StreamType } from "../../model/StreamType";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
const fpPromise = FingerprintJS.load();


interface Props {
  vod: VodModel;
}

const logClick = (user_login: string) => {
  (async () => {
    // Get the visitor identifier when you need it.
    const fp = await fpPromise;
    const result = await fp.get();

    axios.post(process.env.REACT_APP_API_URL + "/stats" || "", {
      user_login: user_login,
      access_date: new Date(),
      type: StreamType.VOD,
      fingerprint: result.visitorId,
    });
  })();
}

export default function VodCard(props: Props) {
  const vod = props.vod;
  
  return (
    <Box
      maxW="md"
      maxH="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      overflowY="clip"
      textOverflow="ellipsis"
      background="white"
    >
      <Link href={"https://twitch.tv/videos/" + vod.stream_id} isExternal={true} onClick={() => logClick(vod.user_login)}>
        <Box
          h="180"
          w="100%"
          position="relative"
          backgroundColor="#33374D"
          backgroundImage={vod.thumbnail_url
            .replace("%{width}", "640")
            .replace("%{height}", "360") || '/logo.svg'}
          backgroundRepeat="no-repeat"
          backgroundSize={vod.thumbnail_url ? 'cover' : '40%'}
          backgroundPosition='center'
          
        >
          
          <Tag
            size="sm"
            position="absolute"
            right={1}
            bottom={1}
            margin="auto"
            variant="solid"
            bg="purple.500"
          >
            {vod.duration}
          </Tag>

          <Tag
            size="sm"
            position="absolute"
            left={1}
            bottom={1}
            margin="auto"
            variant="solid"
            bg="primary.600"
          >
            <ViewIcon />
            &nbsp;{vod.viewer_count}
          </Tag>
        </Box>
      </Link>

      <Box position='relative' pl="5" pr="5" pb="2" pt="4">
        <Link
          href={"https://twitch.tv/" + vod.user_name}
          isExternal={true} onClick={() => logClick(vod.user_login)}
        >
          <Flex mt="0" fontWeight="semibold" lineHeight="tight">
            <Image
              w="8"
              borderRadius="full"
              src={vod.profile_image_url}
              alt={vod.user_name}
            />
            &nbsp;{vod.user_name}
          </Flex>
        </Link>
        <chakra.p mt="2" fontWeight="semibold" lineHeight="tight" isTruncated>
          <Tooltip label={vod.title} aria-label="A tooltip">
            {vod.title}
          </Tooltip>
        </chakra.p>

        <Divider mt="3"></Divider>

        <chakra.div h='70px'>
          <chakra.p className="description" overflow="hidden" textOverflow="ellipsis">
            {vod.description}
          </chakra.p>
        </chakra.div>

        <Divider mt="3"mb='4'></Divider>
        <SocialLinks streamer={vod} />
      </Box>
    </Box>
  );
}
