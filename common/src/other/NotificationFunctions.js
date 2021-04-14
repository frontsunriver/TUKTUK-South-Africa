import {
    cloud_function_server_url
} from 'config';

export function RequestPushMsg(token, title, msg) {
    fetch(`${cloud_function_server_url}/send_notification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token": token,
            "title": title,
            "msg": msg
        })
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error)
    });
}