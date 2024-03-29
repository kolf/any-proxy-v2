/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-04-15 14:21:28
 * @LastEditors: kolf kolf@live.cn
 * @LastEditTime: 2023-04-22 15:20:32
 * @FilePath: /any-proxy/src/renderer/src/components/AppLayout.tsx
 * @Description:
 */
import * as React from 'react'
import Icon from '@ant-design/icons'
import { Layout, Input, Space } from 'antd'
import { Table, Props as TableProps } from '../table'
import { createId, formatDate } from '../../utils'
import { AppSider } from '../app-sider'
const { Content, Sider } = Layout
import { Play, Remove, Setting, Pause } from '../icon'
const columns: TableProps['columns'] = [
  {
    title: '#',
    dataIndex: 'index',
    width: 68
  },
  {
    title: 'Method',
    dataIndex: 'method',
    width: 60
  },
  {
    title: 'Code',
    dataIndex: 'statusCode',
    width: 54
  },
  {
    title: 'Host',
    dataIndex: 'host',
    width: 160
  },
  {
    title: 'Path',
    dataIndex: 'path'
  },
  {
    title: 'MIME',
    width: 120,
    dataIndex: 'mime'
  },
  {
    title: 'Time',
    width: 72,
    dataIndex: 'startTime',
    render: (records) => {
      const timeStr = formatDate(records.startTime, 'hh:mm:ss')
      return timeStr
    }
  }
]

const makeData = (data, inputValue) => {
  console.log(data, 'dataSource')
  // console.log(dataSource.values(), 'dataSource.values()')
  return data
    .filter((item) => item.host && item.path)
    .filter((item) =>
      inputValue ? item.host.includes(inputValue) || item.path.includes(inputValue) : true
    )
}

export const AppLayout: React.FC = () => {
  // const [dataMap, update] = React.useState(new Map())
  const [data, setData] = React.useState<any[]>([])
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [inputValue, setInputValue] = React.useState<string>('')

  React.useEffect(() => {
    if (!window.electron) {
      return
    }
    const { ipcRenderer } = window.electron
    ipcRenderer?.on('to-get-req', update)
    ipcRenderer?.send('ready-to-init-proxy')

    function update(_, reqData): void {
      const req = JSON.parse(reqData)
      const _key = createId()
      setData((data) => [...data, { ...req, _key }])
    }
  }, [window])

  return (
    <Layout style={{ height: '100vh' }}>
      <Content>
        <Layout style={{ height: '100%' }}>
          <div className="app-header">
            <Space size={24} style={{ flex: 1, paddingTop: 4 }}>
              <div style={{ textAlign: 'center' }}>
                <Icon component={Play} />

                <p>开始</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Icon component={Pause} />

                <p>暂停</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Icon component={Remove} />

                <p>清除</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Icon component={Setting} />

                <p>设置</p>
              </div>
            </Space>
            <Input
              style={{ width: 300, backgroundColor: '#eee' }}
              placeholder="请输入域名或者路径"
              bordered={false}
              allowClear
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <Content style={{ height: '100%' }}>
            <Table
              rowKey="_key"
              dataSource={makeData(data, inputValue)}
              columns={columns}
              onRowClick={setSelectedItem}
            />
          </Content>
        </Layout>
      </Content>
      <Sider width={400} style={{ borderLeft: '1px solid #e0e0e0' }}>
        <AppSider dataSource={selectedItem} />
      </Sider>
    </Layout>
  )
}
