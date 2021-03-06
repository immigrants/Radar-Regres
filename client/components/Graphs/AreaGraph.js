import React from 'react'
import {CustomTooltip} from './CustomToolTips.js'
import {AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts'
import TableDB from './TableDB'

const AreaGraphs = (props) => {
  const {title, x, y, savedQuery, aggregateInformation, width, height, fill, stroke} = props
  return (
    <div className="col-md-6">
        <h5 className="form-labels"><strong> {title} </strong></h5>
        <AreaChart
        width={width}
        height={height}
        data={savedQuery}>
        <XAxis dataKey={x} name={x} />
        <YAxis datakey={y} name={y} />
        <Tooltip content={CustomTooltip} />
        <Area type="monotone" dataKey={y} stroke={stroke} fill={fill} name={title} />
      </AreaChart>
        {aggregateInformation && <TableDB Title={title + ' aggregate Info'} savedQuery={aggregateInformation} />}
    </div>
  )
}

export default AreaGraphs
