import React, { useState } from 'react';
import './App.css';
import "antd/dist/antd.css";
import { CarOutlined, InboxOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import {
  Input, Button, Select,
  Row, Col, Table
} from 'antd';
const { Option } = Select;

function App() {

  const [Tcode, setTcode] = useState('');
  const [Tinvoice, setTinvoice] = useState('');
  const [TrackingDetails, setTrackingDetails] = useState([]);

  const columns = [
    {
      title: '시간',
      dataIndex: 'timeString',
      width: 120
    },
    {
      title: '현재위치',
      dataIndex: 'where',
      width: 110
    },
    {
      title: '배송상태',
      dataIndex: 'kind',
      width: 220
    }
  ];

  const dataSource = () => {
    let data = [];

    TrackingDetails.map((value, index) => {
      return data.push({
        key: index, timeString: value.timeString,
        where: value.where, kind: value.kind
      });
    });

    data.reverse();
    return data;
  }

  const handleSelect = (value) => {
    setTcode(value);
  }

  const handleInput = (event) => {
    setTinvoice(event.target.value);
  }

  const onSubmit = () => {
    let body = {
      tCode: Tcode,
      tInvoice: Tinvoice
    }

    axios.post('/api/lookup', body)
      .then(response => {
        if (response.data.success) {
          console.log(response.data.trackingInfo.level);
          console.log(response.data.trackingInfo.trackingDetails);
          setTrackingDetails(response.data.trackingInfo.trackingDetails);
          resetImage();
          let level = String(response.data.trackingInfo.level);
          document.getElementById(`level${level}`).style.color = 'lightgreen';
        } else {
          resetImage();
          alert(response.data.msg);
        }
      })
  }
  
  const resetImage = () => {
    for(let i=1; i<=6;i++){
      document.getElementById(`level${i}`).style.color = 'black';
    }
  }


  return (
    <div style={{ width: '100%', margin: '0' }}>
      <div style={{ width: '450px', margin: 'auto' }}>
        <div style={{ marginTop: '100px' }}>
          <h1>택배 배송 조회</h1>
        </div>
        <div>
          <Row gutter={16}>
            <Col>
              <Select defaultValue="0" size="large" style={{ width: 150 }} onChange={handleSelect}>
                <Option value="0">택배사</Option>
                <Option value="04">CJ대한통운</Option>
                <Option value="05">한진택배</Option>
                <Option value="23">경동택배</Option>
              </Select>
            </Col>
            <Col>
              <Input size="large" style={{ width: 200 }} placeholder="운송장 번호" onChange={handleInput} />
            </Col>
            <Col>
              <Button type="primary" size="large" onClick={onSubmit}>조회</Button>
            </Col>
          </Row>
        </div>
        <div>
          <br />
          <h2>배송 현황</h2>
            <div style={{ display: 'flex', textAlign: 'center' }}>
              <div id='level1'></div>
              <div id='level2' style={{ margin: '15px' }}>
                <InboxOutlined style={{ fontSize: '30px' }} /><br />
                상품인수
              </div>
              <div id='level3' style={{ margin: '15px' }}>
                <CarOutlined style={{ fontSize: '30px' }} /><br />
                상품이동
              </div>
              <div id='level4' style={{ margin: '15px' }}>
                <HomeOutlined style={{ fontSize: '30px' }} /><br />
                배송지도착
              </div>
              <div id='level5' style={{ margin: '15px' }}>
                <CarOutlined style={{ fontSize: '30px' }} /><br />
                배송출발
              </div>
              <div id='level6' style={{ margin: '15px' }}>
                <HomeOutlined style={{ fontSize: '30px' }} /><br />
                배송완료
              </div>
            </div>
          <Table
            columns={columns}
            dataSource={dataSource()}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
