from flaskSever import app
import unittest
import json

class FlaskTestCase (unittest.TestCase):

    def testAvailability (self):
        tester = app.test_client(self)
        response = tester.post("/test",content_type = "json/text")
        self.assertEqual(response.status_code,200)
        self.assertTrue("OK" in str(response.data))

    def testElucidASR (self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/info/asr",content_type = "json/text")
        self.assertEqual(response.status_code,200)

    def testElucidBFS (self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/info/bfs",content_type = "json/text")
        self.assertEqual(response.status_code,200)

    def testElucidDKS (self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/info/dks",content_type = "json/text")
        self.assertEqual(response.status_code,200)

    def testElucidDFS (self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/info/dfs",content_type = "json/text")
        self.assertEqual(response.status_code,200)

    def testElucidUCS (self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/info/ucs",content_type = "json/text")
        self.assertEqual(response.status_code,200)

    def testPathASR(self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/asr",   
                                content_type = "application/json",
                                data = json.dumps(dict())
                                )
        self.assertEqual(response.status_code,400)
        return

    def testPathDFS(self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/dfs",   
                                content_type = "application/json",
                                data = json.dumps(dict())
                                )
        self.assertEqual(response.status_code,404)
        return

    def testPathBFS(self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/bfs",   
                                content_type = "application/json",
                                data = json.dumps(dict())
                                )
        self.assertEqual(response.status_code,400)
        return

    def testPathASR(self):
        tester = app.test_client(self)
        response = tester.post("/api/v1/asr",   
                                content_type = "application/json",
                                data = json.dumps(dict())
                                )
        self.assertEqual(response.status_code,400)
        return
    def testCorrect(self):
        tester = app.test_client(self)
        data = {
            "nodes" : ['1','2'],
            "edges" : [["1","2"]],
            "weights" : [0],
            "src" : "1",
            "dst" : "2"
        }
        response = tester.post("/api/v1/bfs",   
                                content_type = "application/json",
                                data = json.dumps(data)
                                )
        self.assertEqual(response.status_code,200)
        response = tester.post("/api/v1/Uniform",   
                                content_type = "application/json",
                                data = json.dumps(data)
                                )
        self.assertEqual(response.status_code,200)
        return
    def testErroes(self):
        tester = app.test_client(self)
        data = {
            "node" : ['1','2'],
            "edges" : [],
            "weights" : [],
            "src" : "1",
            "dst" : "3"
        }
        response = tester.post("/api/v1/bfs",   
                                content_type = "application/json",
                                data = json.dumps(data)
                                )
        self.assertEqual(response.status_code,400)
        response = tester.post("/api/v1/Uniform",   
                                content_type = "application/json",
                                data = json.dumps(data)
                                )
        self.assertEqual(response.status_code,400)
        return

if __name__ == "__main__":
    unittest.main()