from flaskSever import app
import unittest

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


    def testPathASR():
        tester = app.test_client(self)
        response = tester.post("/api/v1/asr",
                                content_type = "json/text",
                                
                                )
        self.assertEqual(response.status_code,200)

if __name__ == "__main__":
    unittest.main()