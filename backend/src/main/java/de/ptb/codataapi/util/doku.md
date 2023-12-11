# Client_Service Backend API

This API exposes endpoints to manage client Backend.

**Contact information:**

Physikalisch-Technische Bundesanstalt

https://www.ptb.de

Daniel.Hutzschenreuter@ptb.de

> Version: 1.0.0

Base URL: https://d-si.ptb.de/api/client

## Client Controller

Controller with endpoints to manage Client-Backend.

### POST Request:  /api/client/addParticipant

Add a paricipant to participant list

Request URL: https://d-si.ptb.de/api/client/addParicipant
> Example Body Payload

```json
{
  "name": "Physikalisch-Technische Bundesanstalt (PTB)",
  "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-PTB9608"
}
```

### Payload

| Name | Type | Required    |
|------|------|-------------|
| body | body | Participant |

#### Response Examples

> 201 Response message

```
Participant successful created
```

### Responses

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 201              | OK      | created              |

### POST Request: /api/client/addReport

Place a DKCR report with participant List
Request URL: https://d-si.ptb.de/api/client/addReport

> Example Body Payload

```json
 {
  "pidReport": "CCM-KC1",
  "participantList": [
    {
      "participant": {
        "name": "Physikalisch-Technische",
        "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-PTB9608"
      }
    },
    {
      "participant": {
        "name": "NPL",
        "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-NPL9507"
      }
    },
    {
      "participant": {
        "name": "Kriss",
        "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-KRISS9703"
      }
    }
  ]
}
```

### Payload

| Name | Type | Required |
|------|------|----------|
| body | body | Report   |

#### Response Examples

> 201 Response message

```
Report successful created
```

### Responses

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 201              | OK      | created              |

### GET Request: /api/client/report

Get DKCR report.

Request URL: https://d-si.ptb.de/api/client/report

#### Response Example

> 200 Response

```json
{
  "pidReport": "CCM-KC1",
  "participantList": [
    {
      "name": "Physikalisch-Technische Bundesanstalt (PTB)",
      "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-PTB9608"
    },
    {
      "name": "NPL",
      "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-NPL9507"
    }
  ]
}
```

### Response

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 200              | OK      | successful operation |

### /api/client/participants

Get participant list.

Request URL: https://d-si.ptb.de/api/client/participants

#### Response Example

```json
{
  "participantList": [
    {
      "name": "Physikalisch-Technische Bundesanstalt (PTB)",
      "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-PTB9608"
    },
    {
      "name": "NPL",
      "pidDCC": "https://d-si.ptb.de/d-dcc/dcc/CCM.M-K1-NPL9507"
    }
  ]
}
```

### Response

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 200              | OK      | successful operation |

### DELETE Request /api/client/delete/{id}

Delete a participant by ID.

Request URL: https://d-si.ptb.de/api/client/delete/{id}

### Params

| Name | Location | Type | Required | Description            |
|------|----------|------|----------|------------------------|
| id   | path     | long | true     | participant identifier |

#### Request Example:

> Request URL:
https://d-si.ptb.de/api/client/delete/2

#### Response Example

> 200 Response
> ```
> participant deleted
> ```

### Response

| HTTP Status Code | Meaning | Description          | Data schema |
|------------------|---------|----------------------|-------------|
| 200              | OK      | successful operation | string      |

### DELETE Request: /api/client/deleteAll

Delete all participants.

Request URL: https://d-si.ptb.de/api/client/deleteAll

#### Request Example:

> Request URL:
https://d-si.ptb.de/api/client/deleteAll

#### Response Example

> 200 Response
> ```
> participant list deleted
> ```

### Response

| HTTP Status Code | Meaning | Description          | Data schema |
|------------------|---------|----------------------|-------------|
| 200              | OK      | successful operation | string      |

### GET Request /api/client/download

Request URL: https://d-si.ptb.de/api/download

##### Responses

| Code | Description |
|------|-------------|
| 200  | OK          |


