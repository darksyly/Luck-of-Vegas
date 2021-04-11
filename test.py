from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time

errorList = ""

d = DesiredCapabilities.CHROME
d['loggingPrefs'] = { 'browser':'ALL' }
driver = webdriver.Chrome('chromedriver.exe', desired_capabilities=d)

driver.get("http://localhost:34567")
i = 0
while(i < 10):
    driver.find_element_by_xpath("//*[@id='username']").send_keys("sepp")
    driver.find_element_by_xpath("//*[@id='password']").send_keys("sepp")
    driver.find_element_by_xpath("/html/body/div/form/input[3]").click()
    time.sleep(5)
    if(driver.current_url != "http://localhost:34567/home"):
        errorList += "try " + str(i) + ")\tfailed login\n"
        i += 1
        continue;
    driver.find_element_by_xpath("//*[@id='bildR']").click()
    time.sleep(5)
    if(driver.current_url != "http://localhost:34567/Roulette"):
        errorList += "try " + str(i) + ")\tfailed to switch to roulette\n"
        i += 1
        continue;
    driver.find_element_by_xpath("//*[@id='logo']").click()
    time.sleep(5)
    if(driver.current_url != "http://localhost:34567/home"):
        errorList += "try " + str(i) + ")\tfailed to return to home\n"
        i += 1
        continue;
    driver.find_element_by_xpath("//*[@id='logout']/button").click()
    driver.get("http://localhost:34567/home")
    time.sleep(5)
    if(driver.current_url != "http://localhost:34567/home"):
        errorList += "try " + str(i) + ")\tLogoutFailed\n"
    i += 1

fp = open("testResult.txt", "w")
fp.write("Errors: " + errorList + "\n\n\n JavaLogs:\n")
for entry in driver.get_log('browser'):
    fp.write(str(entry))
fp.close()
