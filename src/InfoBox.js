import React from 'react'
import './InfoBox.css'
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox({title, cases, isOrange, isRed, total, active, ...props}) {
    return (
        <Card className={`infobox ${active && 'infobox-select'} ${isRed && 'infobox-red'} ${isOrange && 'infobox-orange'}`} onClick={props.onClick}>
            <CardContent>
                <Typography className='infobox-title' color='textSecondary'>
                    {title}
                </Typography>
                <h2 className={`infobox-cases ${!isRed && !isOrange && 'infobox-cases-green'} ${isOrange && 'infobox-cases-orange'}`}>{cases}</h2>
                <Typography className='infobox-total' color='textSecondary'>
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
