import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Center,
  Container,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import React from "react";
import ReactApexChart from "react-apexcharts";

import { StatModel } from "../../model/StatModel";

export default function StatsPage() {
  const [stats, setStats] = React.useState([]);
  const [statsSummary, setStatsSummary] = React.useState({
    streams: 0,
    vods: 0,
  });

  React.useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/stats").then((response) => {
      setStats(response.data);
    });

    axios
      .get(process.env.REACT_APP_API_URL + "/stats/summary")
      .then((response) => {
        setStatsSummary(response.data);
      });
  }, []);

  const options: ApexOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    colors: ["#B685FF", "#D3C8FF"],

    legend: {
      show: true,
      position: "top",
      labels: {
        colors: ["#B685FF", "#D3C8FF"],
        useSeriesColors: true,
      },
    },
    labels: ["Lives", "Vods"],
  };

  return (
    <>
      <Container>
        <IconButton
          colorScheme="primary"
          aria-label="Voltar"
          onClick={() => window.history.back()}
          icon={<ArrowBackIcon />}
        />
        <Center>
          <h1>Stats</h1>
        </Center>

        <Table size="sm" color="primary.400">
          <Thead>
            <Tr>
              <Th color="primary.600">Streamer</Th>
              <Th isNumeric color="primary.600">
                Acessos em Lives
              </Th>
              <Th isNumeric color="primary.600">
                Acessos em Vods
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {stats.map((stat: StatModel) => {
              return (
                <Tr key={stat.user_login}>
                  <Td>{stat.user_login}</Td>
                  <Td isNumeric>{stat.stream_clicks}</Td>
                  <Td isNumeric>{stat.vod_clicks}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Center mt="10">
          <ReactApexChart
            options={options}
            series={[statsSummary.streams, statsSummary.vods]}
            type="pie"
            width={380}
          />
        </Center>
      </Container>
    </>
  );
}
