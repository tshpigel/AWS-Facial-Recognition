import boto3
from botocore.exceptions import ClientError
import base64
from imageio import imread
import io

reko = boto3.client('rekognition')

def recog(event, context):
    b64 = event.get('body')
    dec = base64.b64decode(b64)
    i = imread(io.BytesIO(dec))

    threshold = 70
    maxFaces = 2

    compare = reko.search_faces_by_image(CollectionId="atley-collection", Image=i, FaceMatchThreshold=threshold, MaxFaces=maxFaces)

    result = compare['FaceMatches']['Face']['ExternalImageId']
    return result